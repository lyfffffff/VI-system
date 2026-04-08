// ThemeDrawer Story 集合：覆盖基础交互与主题回归场景。
import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import { ThemeDrawer, THEME_PRESETS } from "@yyxxfe/vi";
import type { ThemeColorKey } from "@yyxxfe/vi";
import ThemeDrawerPlayground from "./theme-drawer/theme-drawer-playground.vue";
import ThemeDrawerRegressionMatrix from "./theme-drawer/theme-drawer-regression-matrix.vue";
import ThemeDrawerVariantSwatches from "./theme-drawer/theme-drawer-variant-swatches.vue";

const meta: Meta<typeof ThemeDrawer> = {
  title: "主题/主题抽屉",
  component: ThemeDrawer,
  tags: ["autodocs"],
  args: {
    open: false,
    placement: "right",
    themes: THEME_PRESETS,
    onUpdateOpen: fn<(open: boolean) => void>(),
    onThemeChange: fn<(themeKey: ThemeColorKey) => void>(),
    onModeChange: fn<(isDark: boolean) => void>(),
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "抽屉是否打开",
      table: {
        category: "Props",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    placement: {
      control: "radio",
      options: ["right", "left"],
      description: "抽屉位置",
      table: {
        category: "Props",
        type: { summary: "'right' | 'left'" },
        defaultValue: { summary: "right" },
      },
    },
    themes: {
      control: false,
      description: "自定义主题列表，默认使用 17 个预置主题",
      table: {
        category: "Props",
        type: { summary: "IThemePreset[]" },
      },
    },
    onUpdateOpen: {
      name: "update:open",
      control: false,
      description: "抽屉开关变化时触发",
      table: {
        category: "回调钩子",
        type: { summary: "(open: boolean) => void" },
      },
    },
    onThemeChange: {
      name: "theme-change",
      control: false,
      description: "主题切换成功后触发",
      table: {
        category: "回调钩子",
        type: { summary: "(themeKey: ThemeColorKey) => void" },
      },
    },
    onModeChange: {
      name: "mode-change",
      control: false,
      description: "浅色/暗黑模式切换后触发",
      table: {
        category: "回调钩子",
        type: { summary: "(isDark: boolean) => void" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: [
          "主题设置抽屉组件，提供浅/暗模式切换和 17 个预置主题切换。",
          "",
          "V2 契约：样式改造优先级为 `CSS var > 业务 class > 直接覆盖组件内部样式`。",
          "局部覆盖推荐作用域：`.vi-theme-scope`。",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "Playground",
  render: (args) => ({
    components: { ThemeDrawerPlayground },
    setup() {
      function onStoryUpdateOpen(v: boolean): void {
        args.onUpdateOpen?.(v);
      }
      function onStoryThemeChange(k: ThemeColorKey): void {
        args.onThemeChange?.(k);
      }
      function onStoryModeChange(dark: boolean): void {
        args.onModeChange?.(dark);
      }
      return { args, onStoryUpdateOpen, onStoryThemeChange, onStoryModeChange };
    },
    template: `
      <ThemeDrawerPlayground
        :open="args.open"
        :placement="args.placement"
        :themes="args.themes"
        @story-update-open="onStoryUpdateOpen"
        @story-theme-change="onStoryThemeChange"
        @story-mode-change="onStoryModeChange"
      />
    `,
  }),
};

export const ThemeVariantSwatches: Story = {
  name: "主题色卡",
  parameters: {
    docs: {
      description: {
        story:
          "色卡：每个预设主题的主色及 light3～light9 / dark2 变体（与 `getThemeVariants` / CSS `--vi-color-primary-light-*` 一致）。点击卡片可切换全局主题。",
      },
    },
  },
  render: () => ({
    components: { ThemeDrawerVariantSwatches },
    template: "<ThemeDrawerVariantSwatches />",
  }),
};

export const ThemeRegression: Story = {
  name: "主题回归",
  parameters: {
    docs: {
      description: {
        story: "回归场景：亮/暗切换 + 17 色切换。用于验证主题变量链路。",
      },
    },
  },
  render: () => ({
    components: { ThemeDrawerRegressionMatrix },
    template: "<ThemeDrawerRegressionMatrix />",
  }),
};
