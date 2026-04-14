import path from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import type { StorybookConfig } from "@storybook/vue3-vite";

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const storybookAppRoot = path.resolve(storybookDir, "..");
/** 仓库根：与工作区内源码 alias 一致，供 Vite 放行读盘 */
const repoRoot = path.resolve(storybookDir, "../../..");
const viPackageRoot = path.join(repoRoot, "packages/vi");

const viSourceEntry = path.join(viPackageRoot, "src/index.ts");
const viDistEntry = path.join(viPackageRoot, "dist/index.js");
const viSourceStylesEntry = path.join(viPackageRoot, "src/index.ts");
const viDistStylesEntry = path.join(viPackageRoot, "dist/style.css");

// 默认使用源码模式，只有显式设置 VI_SOURCE_MODE=false 时才用构建模式
const isSourceMode = process.env.VI_SOURCE_MODE !== "false";
const viDevAliases = [
  { find: "@yyxxfe/vi/styles", replacement: isSourceMode ? viSourceStylesEntry : viDistStylesEntry },
  { find: "@yyxxfe/vi", replacement: isSourceMode ? viSourceEntry : viDistEntry },
] as const;

// 输出当前模式
if (isSourceMode) {
  console.log("📚 Storybook 模式: 源码模式 (Source Mode)");
  console.log("📦 VI 库入口:", viSourceEntry);
} else {
  console.log("📚 Storybook 模式: 构建模式 (Distribution Mode)");
  console.log("📦 VI 库入口:", viDistEntry);
}

function mergeViteAlias(
  existing: import("vite").ResolveOptions["alias"]
): import("vite").ResolveOptions["alias"] {
  if (Array.isArray(existing)) {
    return [...viDevAliases, ...existing];
  }
  if (existing && typeof existing === "object") {
    return [
      ...viDevAliases,
      ...Object.entries(existing).map(([find, replacement]) => ({
        find,
        replacement: replacement as string,
      })),
    ];
  }
  return [...viDevAliases];
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|js|jsx|mjs)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), vue()];
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = mergeViteAlias(viteConfig.resolve.alias);

    const prevAllow = viteConfig.server?.fs?.allow ?? [];
    viteConfig.server = viteConfig.server ?? {};
    // 源码模式需要访问 vi 源码目录，构建模式只需访问 storybook 应用
    viteConfig.server.fs = {
      ...viteConfig.server.fs,
      allow: isSourceMode
        ? [...prevAllow, storybookAppRoot, viPackageRoot]
        : [...prevAllow, storybookAppRoot],
    };

    return viteConfig;
  },
};

export default config;
