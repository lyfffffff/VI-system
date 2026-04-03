// ThemeDrawer Story 集合：覆盖基础交互与主题回归场景。
import {
  computed,
  ref,
  watch,
} from "vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import {
  ThemeDrawer,
  THEME_PRESETS,
  getThemeVariants,
  initViTheme,
  useViTheme,
} from "@yyxxfe/vi";
import type { IThemePreset, IThemeVariants, ThemeColorKey } from "@yyxxfe/vi";

const meta: Meta<typeof ThemeDrawer> = {
  title: "主题/主题抽屉",
  component: ThemeDrawer,
  tags: ["autodocs"],
  args: {
    open: true,
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
    components: { ThemeDrawer },
    setup() {
      const open = ref(Boolean(args.open));
      initViTheme({ prefix: "vi" });
      const { themeKey, isDark, currentTheme, applyTheme } = useViTheme();
      applyTheme();

      const themes = computed<IThemePreset[] | undefined>(() => {
        if (Array.isArray(args.themes) && args.themes.length > 0) {
          return args.themes as IThemePreset[];
        }
        return THEME_PRESETS;
      });

      watch(
        () => args.open,
        (value) => {
          open.value = Boolean(value);
        },
      );

      // 同步 Storybook 控件中的 open 状态。
      function handleUpdateOpen(nextOpen: boolean): void {
        open.value = nextOpen;
        args.onUpdateOpen?.(nextOpen);
      }

      // 透传主题变更事件给 Storybook actions。
      function handleThemeChange(nextThemeKey: ThemeColorKey): void {
        args.onThemeChange?.(nextThemeKey);
      }

      // 透传模式变更事件给 Storybook actions。
      function handleModeChange(nextDark: boolean): void {
        args.onModeChange?.(nextDark);
      }

      return {
        args,
        open,
        themes,
        themeKey,
        isDark,
        currentTheme,
        handleUpdateOpen,
        handleThemeChange,
        handleModeChange,
      };
    },
    template: `
      <div class="story-root vi-theme-scope">
        <div class="story-header">
          <h3>VI 主题抽屉预览</h3>
          <p>当前主题：{{ currentTheme?.name }}（{{ themeKey }}） / {{ isDark ? '暗黑模式' : '浅色模式' }}</p>
          <el-button type="primary" class="sb-no-flex-stretch" @click="open = true">打开主题抽屉</el-button>
          <el-button type="primary" class="sb-no-flex-stretch" @click="open = true">查询</el-button>
        </div>

        <ThemeDrawer
          v-model:open="open"
          :placement="args.placement"
          :themes="themes"
          @update:open="handleUpdateOpen"
          @theme-change="handleThemeChange"
          @mode-change="handleModeChange"
        />
      </div>
    `,
  }),
};

/** 与 `theme-resolver` 中主色变体 token 一致的展示顺序。 */
const VARIANT_SWATCH_KEYS: { key: keyof IThemeVariants; label: string }[] = [
  { key: "light3", label: "Light 3" },
  { key: "light5", label: "Light 5" },
  { key: "light7", label: "Light 7" },
  { key: "light8", label: "Light 8" },
  { key: "light9", label: "Light 9" },
  { key: "dark2", label: "Dark 2" },
];

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
    setup() {
      initViTheme({ prefix: "vi" });
      const { themeKey, isDark, setTheme, setDark, applyTheme } = useViTheme();
      applyTheme();

      const presetsWithVariants = THEME_PRESETS.map((preset) => ({
        preset,
        variants: getThemeVariants(preset.hex),
      }));

      return {
        presetsWithVariants,
        variantKeys: VARIANT_SWATCH_KEYS,
        themeKey,
        isDark,
        setTheme,
        setDark,
      };
    },
    template: `
      <div class="story-root vi-theme-scope theme-variant-swatches-story">
        <div class="regression-toolbar">
          <h3>主题变体色卡</h3>
          <div class="toolbar-actions">
            <el-switch
              :model-value="isDark"
              inline-prompt
              active-text="暗"
              inactive-text="亮"
              @update:model-value="setDark"
            />
          </div>
        </div>
        <p class="theme-variant-swatches-story__hint">
          每行：主色 + 由主色混合生成的亮阶 / 暗阶；与运行时注入的语义变量一致。点击整卡应用该主题。
        </p>
        <div class="theme-variant-grid">
          <button
            v-for="row in presetsWithVariants"
            :key="row.preset.key"
            type="button"
            class="theme-variant-card"
            :class="{ 'is-active': themeKey === row.preset.key }"
            @click="setTheme(row.preset.key)"
          >
            <div class="theme-variant-card__head">
              <span class="theme-variant-card__en">{{ row.preset.englishName }}</span>
              <span class="theme-variant-card__zh">{{ row.preset.name }}</span>
              <code class="theme-variant-card__key">{{ row.preset.key }}</code>
            </div>
            <div class="theme-variant-swatches" aria-label="主题色与变体">
              <div class="theme-variant-swatch">
                <span
                  class="theme-variant-swatch__chip"
                  :style="{ backgroundColor: row.preset.hex }"
                  :title="'主色 ' + row.preset.hex"
                />
                <span class="theme-variant-swatch__label">Base</span>
              </div>
              <div
                v-for="v in variantKeys"
                :key="row.preset.key + '-' + v.key"
                class="theme-variant-swatch"
              >
                <span
                  class="theme-variant-swatch__chip"
                  :style="{ backgroundColor: row.variants[v.key] }"
                  :title="v.label + ' ' + row.variants[v.key]"
                />
                <span class="theme-variant-swatch__label">{{ v.label }}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    `,
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
    setup() {
      initViTheme({ prefix: "vi" });
      const { themeKey, isDark, setTheme, setDark, applyTheme } = useViTheme();
      const activeIndex = ref(
        THEME_PRESETS.findIndex((item) => item.key === themeKey.value),
      );

      applyTheme();

      watch(
        themeKey,
        (nextThemeKey) => {
          activeIndex.value = THEME_PRESETS.findIndex(
            (item) => item.key === nextThemeKey,
          );
        },
        { immediate: true },
      );

      // 顺序切换到下一个预设主题，用于回归轮询。
      function switchNextTheme(): void {
        const nextIndex = (activeIndex.value + 1) % THEME_PRESETS.length;
        activeIndex.value = nextIndex;
        setTheme(THEME_PRESETS[nextIndex].key);
      }

      return {
        presets: THEME_PRESETS,
        themeKey,
        isDark,
        setTheme,
        setDark,
        switchNextTheme,
      };
    },
    template: `
      <div class="story-root vi-theme-scope">
        <div class="regression-toolbar">
          <h3>主题回归矩阵</h3>
          <div class="toolbar-actions">
            <el-switch
              :model-value="isDark"
              inline-prompt
              active-text="暗"
              inactive-text="亮"
              @update:model-value="setDark"
            />
            <el-button type="primary" class="sb-no-flex-stretch" @click="switchNextTheme">下一主题</el-button>
          </div>
        </div>

        <div class="theme-chip-grid">
          <button
            v-for="item in presets"
            :key="item.key"
            type="button"
            class="theme-chip"
            :class="{ 'is-active': themeKey === item.key }"
            @click="setTheme(item.key)"
          >
            <span class="theme-chip__swatch" :style="{ backgroundColor: item.hex }" />
            <span>{{ item.englishName }}</span>
          </button>
        </div>
      </div>
    `,
  }),
};
