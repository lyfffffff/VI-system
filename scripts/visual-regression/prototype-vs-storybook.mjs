import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const ROOT_DIR = process.cwd();
const DEFAULT_CONFIG_PATH = path.resolve(
  ROOT_DIR,
  "scripts/visual-regression/prototype-vs-storybook.config.mjs",
);
const DEFAULT_OUTPUT_ROOT = path.resolve(ROOT_DIR, ".tmp/visual-regression");

function parseArgs(argv) {
  const args = {
    config: DEFAULT_CONFIG_PATH,
    outputRoot: DEFAULT_OUTPUT_ROOT,
    failOnDiff: undefined,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if ((item === "--config" || item === "-c") && argv[i + 1]) {
      args.config = path.resolve(ROOT_DIR, argv[i + 1]);
      i += 1;
      continue;
    }
    if ((item === "--output" || item === "-o") && argv[i + 1]) {
      args.outputRoot = path.resolve(ROOT_DIR, argv[i + 1]);
      i += 1;
      continue;
    }
    if (item === "--no-fail") {
      args.failOnDiff = false;
      continue;
    }
    if (item === "--fail-on-diff") {
      args.failOnDiff = true;
      continue;
    }
    if (item === "--dry-run") {
      args.dryRun = true;
    }
  }

  return args;
}

async function loadConfig(configPath) {
  const modulePath = pathToFileURL(configPath).href;
  const loaded = await import(modulePath);
  const config = loaded.default ?? loaded.config;
  if (!config) {
    throw new Error(`Config not found in ${configPath}`);
  }
  return config;
}

function timestamp() {
  const now = new Date();
  const parts = [
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ];
  return parts.join("");
}

async function ensureDir(target) {
  await fs.mkdir(target, { recursive: true });
}

async function waitForReady(page, selector) {
  if (!selector) return;
  await page.waitForSelector(selector, { state: "visible", timeout: 30000 });
}

async function runPageActions(page, actions, pageLabel) {
  if (!Array.isArray(actions) || actions.length === 0) return;

  for (const action of actions) {
    const type = action.type ?? "click";
    const optional = action.optional ?? false;

    try {
      if (type === "waitMs") {
        const delay = Number(action.ms ?? action.waitMs ?? 0);
        if (delay > 0) {
          await page.waitForTimeout(delay);
        }
        continue;
      }

      if (type === "waitForSelector") {
        await page.waitForSelector(action.selector, {
          state: action.state ?? "visible",
          timeout: action.timeoutMs ?? 10000,
        });
        continue;
      }

      if (type === "click") {
        if (!action.selector) {
          throw new Error("click action requires selector");
        }
        const locator = page.locator(action.selector);
        const target =
          typeof action.nth === "number" ? locator.nth(action.nth) : locator.first();
        await target.waitFor({
          state: action.state ?? "visible",
          timeout: action.timeoutMs ?? 10000,
        });
        await target.click({
          timeout: action.timeoutMs ?? 10000,
          force: action.force ?? false,
        });
        continue;
      }

      throw new Error(`Unsupported action type: ${type}`);
    } catch (error) {
      if (optional) {
        console.warn(
          `[WARN] Optional pre-action skipped on ${pageLabel}: ${JSON.stringify(action)} (${error.message})`,
        );
        continue;
      }
      throw error;
    }
  }
}

async function captureBySelector(page, selector, outputPath) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: "visible", timeout: 30000 });
  await locator.scrollIntoViewIfNeeded();
  await locator.screenshot({
    path: outputPath,
    animations: "disabled",
  });
}

async function readPng(filePath) {
  const raw = await fs.readFile(filePath);
  return PNG.sync.read(raw);
}

function normalizePngSize(source, width, height) {
  const normalized = new PNG({ width, height });
  PNG.bitblt(
    source,
    normalized,
    0,
    0,
    source.width,
    source.height,
    0,
    0,
  );
  return normalized;
}

function toRateText(value) {
  return `${(value * 100).toFixed(3)}%`;
}

async function writeReport(outputDir, runtime, results) {
  const lines = [
    "# Prototype vs Storybook Visual Report",
    "",
    `- Generated at: ${new Date().toISOString()}`,
    `- Prototype URL: ${runtime.prototypeUrl}`,
    `- Storybook URL: ${runtime.storybookUrl}`,
    `- Pixel threshold: ${runtime.pixelmatchThreshold}`,
    `- Max diff rate: ${toRateText(runtime.maxDiffRate)}`,
    "",
    "| Scenario | Diff Pixels | Diff Rate | Pass |",
    "| --- | ---: | ---: | :---: |",
  ];

  for (const row of results) {
    lines.push(
      `| ${row.name} | ${row.diffPixels} | ${toRateText(row.diffRate)} | ${row.pass ? "Y" : "N"} |`,
    );
  }

  lines.push("", "## Files");
  for (const row of results) {
    lines.push(`- ${row.name}`);
    lines.push(`  - prototype: ${row.prototypeImage}`);
    lines.push(`  - storybook: ${row.storybookImage}`);
    lines.push(`  - diff: ${row.diffImage}`);
  }

  await fs.writeFile(
    path.join(outputDir, "report.md"),
    `${lines.join("\n")}\n`,
    "utf8",
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = await loadConfig(args.config);
  const runId = timestamp();
  const outputDir = path.join(args.outputRoot, runId);

  const runtime = {
    prototypeUrl: config.prototypeUrl,
    storybookUrl: config.storybookUrl,
    viewport: config.viewport ?? { width: 1920, height: 1080 },
    pixelmatchThreshold: config.pixelmatchThreshold ?? 0.1,
    maxDiffRate: config.maxDiffRate ?? 0.005,
    failOnDiff: args.failOnDiff ?? config.failOnDiff ?? true,
    settleTimeMs: config.settleTimeMs ?? 2000,
    randomSeed: config.randomSeed,
    fixedNow: config.fixedNow,
    preActions: config.preActions ?? {},
    scenarios: config.scenarios ?? [],
    ready: config.ready ?? {},
  };

  if (!runtime.prototypeUrl || !runtime.storybookUrl) {
    throw new Error("Config must include prototypeUrl and storybookUrl.");
  }
  if (!Array.isArray(runtime.scenarios) || runtime.scenarios.length === 0) {
    throw new Error("Config must include scenarios.");
  }

  if (args.dryRun) {
    console.log("Config check passed.");
    console.log(`Prototype URL: ${runtime.prototypeUrl}`);
    console.log(`Storybook URL: ${runtime.storybookUrl}`);
    console.log(`Scenarios: ${runtime.scenarios.length}`);
    for (const scenario of runtime.scenarios) {
      console.log(`- ${scenario.name}`);
    }
    return;
  }

  await ensureDir(outputDir);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: runtime.viewport,
    deviceScaleFactor: 1,
  });

  if (typeof runtime.randomSeed === "number" && Number.isFinite(runtime.randomSeed)) {
    await context.addInitScript(({ seed }) => {
      let state = Math.floor(seed) >>> 0;
      Math.random = () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 4294967296;
      };
    }, { seed: runtime.randomSeed });
  }

  if (runtime.fixedNow) {
    const fixedMs = Number.isFinite(Number(runtime.fixedNow))
      ? Number(runtime.fixedNow)
      : Date.parse(String(runtime.fixedNow));
    if (Number.isFinite(fixedMs)) {
      await context.addInitScript(({ nowMs }) => {
        const RealDate = Date;
        class MockDate extends RealDate {
          constructor(...args) {
            if (args.length === 0) {
              super(nowMs);
            } else {
              super(...args);
            }
          }
          static now() {
            return nowMs;
          }
        }
        // Keep Date utility methods consistent with native behavior.
        MockDate.parse = RealDate.parse;
        MockDate.UTC = RealDate.UTC;
        globalThis.Date = MockDate;
      }, { nowMs: fixedMs });
    }
  }

  const prototypePage = await context.newPage();
  const storybookPage = await context.newPage();

  const results = [];
  let hasFailure = false;

  try {
    await Promise.all([
      prototypePage.goto(runtime.prototypeUrl, { waitUntil: "networkidle" }),
      storybookPage.goto(runtime.storybookUrl, { waitUntil: "networkidle" }),
    ]);

    await Promise.all([
      waitForReady(prototypePage, runtime.ready.prototype),
      waitForReady(storybookPage, runtime.ready.storybook),
    ]);
    if (runtime.settleTimeMs > 0) {
      await Promise.all([
        prototypePage.waitForTimeout(runtime.settleTimeMs),
        storybookPage.waitForTimeout(runtime.settleTimeMs),
      ]);
    }
    await Promise.all([
      runPageActions(
        prototypePage,
        runtime.preActions.prototype,
        "prototype",
      ),
      runPageActions(
        storybookPage,
        runtime.preActions.storybook,
        "storybook",
      ),
    ]);
    if (runtime.settleTimeMs > 0) {
      await Promise.all([
        prototypePage.waitForTimeout(runtime.settleTimeMs),
        storybookPage.waitForTimeout(runtime.settleTimeMs),
      ]);
    }

    for (const scenario of runtime.scenarios) {
      const scenarioName = scenario.name;
      const prototypeSelector =
        scenario.prototypeSelector ?? scenario.selector ?? "";
      const storybookSelector =
        scenario.storybookSelector ?? scenario.selector ?? "";

      if (!scenarioName || !prototypeSelector || !storybookSelector) {
        throw new Error(
          `Invalid scenario. name/prototypeSelector/storybookSelector are required. Received: ${JSON.stringify(scenario)}`,
        );
      }
      if (scenario.waitMs && scenario.waitMs > 0) {
        await Promise.all([
          prototypePage.waitForTimeout(scenario.waitMs),
          storybookPage.waitForTimeout(scenario.waitMs),
        ]);
      }

      const scenarioDir = path.join(outputDir, scenarioName);
      await ensureDir(scenarioDir);

      const prototypeImage = path.join(scenarioDir, "prototype.png");
      const storybookImage = path.join(scenarioDir, "storybook.png");
      const diffImage = path.join(scenarioDir, "diff.png");

      await Promise.all([
        captureBySelector(prototypePage, prototypeSelector, prototypeImage),
        captureBySelector(storybookPage, storybookSelector, storybookImage),
      ]);

      const prototypePng = await readPng(prototypeImage);
      const storybookPng = await readPng(storybookImage);
      const width = Math.max(prototypePng.width, storybookPng.width);
      const height = Math.max(prototypePng.height, storybookPng.height);

      const normalizedPrototype = normalizePngSize(prototypePng, width, height);
      const normalizedStorybook = normalizePngSize(storybookPng, width, height);
      const diffPng = new PNG({ width, height });

      const diffPixels = pixelmatch(
        normalizedPrototype.data,
        normalizedStorybook.data,
        diffPng.data,
        width,
        height,
        {
          threshold: runtime.pixelmatchThreshold,
        },
      );

      await fs.writeFile(diffImage, PNG.sync.write(diffPng));

      const pixelTotal = width * height;
      const diffRate = pixelTotal > 0 ? diffPixels / pixelTotal : 0;
      const maxDiffRate = scenario.maxDiffRate ?? runtime.maxDiffRate;
      const pass = diffRate <= maxDiffRate;
      if (!pass) hasFailure = true;

      const row = {
        name: scenarioName,
        diffPixels,
        diffRate,
        pass,
        prototypeImage: path.relative(outputDir, prototypeImage),
        storybookImage: path.relative(outputDir, storybookImage),
        diffImage: path.relative(outputDir, diffImage),
      };
      results.push(row);

      const status = pass ? "PASS" : "FAIL";
      console.log(
        `[${status}] ${scenarioName} diff=${toRateText(diffRate)} pixels=${diffPixels}`,
      );
    }

    await writeReport(outputDir, runtime, results);
    console.log(`Report saved: ${path.join(outputDir, "report.md")}`);

    if (hasFailure && runtime.failOnDiff) {
      process.exitCode = 1;
    }
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
