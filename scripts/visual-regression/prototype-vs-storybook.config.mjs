export default {
  prototypeUrl: "http://127.0.0.1:5173/data-cockpit",
  storybookUrl:
    "http://127.0.0.1:6006/iframe.html?id=theme-prototype-regression--data-cockpit-prototype&viewMode=story",
  viewport: {
    width: 1920,
    height: 1080,
  },
  ready: {
    prototype: ".workbench-layout",
    storybook: ".prototype-regression-story",
  },
  pixelmatchThreshold: 0.1,
  maxDiffRate: 0.005,
  failOnDiff: true,
  settleTimeMs: 5000,
  randomSeed: 20260402,
  preActions: {
    prototype: [
      {
        type: "click",
        selector: "button:has-text('昨日')",
        timeoutMs: 10000,
      },
    ],
    storybook: [
      {
        type: "click",
        selector: "button:has-text('昨日')",
        timeoutMs: 10000,
      },
    ],
  },
  scenarios: [
    {
      name: "header",
      prototypeSelector: ".workbench-topbar",
      storybookSelector: ".workbench-topbar",
    },
    {
      name: "menu",
      prototypeSelector: ".workbench-sidebar",
      storybookSelector: ".workbench-sidebar",
    },
    {
      name: "history-tabs",
      prototypeSelector: ".workbench-layout__tags-shell",
      storybookSelector: ".workbench-layout__tags-shell",
    },
    {
      name: "filter",
      prototypeSelector: ".cockpit-page > .flex.justify-between.items-center",
      storybookSelector: ".workbench-filter",
    },
    {
      name: "metrics",
      prototypeSelector: ".cockpit-page > .relative",
      storybookSelector: ".workbench-metrics-shell",
    },
    {
      name: "chart",
      prototypeSelector: ".cockpit-page > .wb-soft-panel:not(.table-section)",
      storybookSelector: ".workbench-chart-panel",
    },
    {
      name: "table",
      prototypeSelector: ".cockpit-page > .table-section",
      storybookSelector: ".wb-table-panel",
    },
  ],
};
