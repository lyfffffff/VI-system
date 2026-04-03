// ThemeDrawer Story 集合：覆盖基础交互、主题回归、组件回归和前缀/局部覆盖验证。
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
  type CSSProperties,
} from "vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import { ThemeDrawer, THEME_PRESETS, initViTheme, useViTheme } from "@yyxxfe/vi";
import type { IThemePreset, ThemeColorKey } from "@yyxxfe/vi";

const meta: Meta<typeof ThemeDrawer> = {
  title: "Theme/Theme Drawer",
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

export const ThemeRegression: Story = {
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

export const ComponentRegression: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "回归场景：时间筛选条、按钮、输入、选择器、文本域、表格、抽屉、弹窗、标签页/单选。",
      },
    },
  },
  render: () => ({
    setup() {
      const drawerOpen = ref(false);
      const dialogOpen = ref(false);
      const selectValue = ref("all");
      const inputValue = ref("数据驾驶舱");
      const textareaValue = ref("这里用于验证 el-textarea 的圆角与边框映射。");
      const tabValue = ref("dashboard");
      const period = ref("day");
      initViTheme({ prefix: "vi" });
      const { isDark, setDark, applyTheme } = useViTheme();

      applyTheme();

      const selectOptions = [
        { label: "全部发行", value: "all" },
        { label: "仅国内", value: "cn" },
        { label: "仅海外", value: "global" },
      ];

      const tableData = [
        { game: "伏魔", revenue: "1,092,301", cost: "302,110", roi: "3.61" },
        { game: "永恒之门", revenue: "892,170", cost: "251,908", roi: "3.54" },
      ];

      const timeShortcuts = [
        { label: "今日", value: "today" },
        { label: "昨日", value: "yesterday" },
      ];

      const activeShortcut = ref("today");
      const reportDate = ref("2026-03-30");

      // 设置时间快捷按钮激活态。
      function setActiveShortcut(value: string): void {
        activeShortcut.value = value;
      }

      return {
        drawerOpen,
        dialogOpen,
        selectValue,
        inputValue,
        textareaValue,
        tabValue,
        period,
        selectOptions,
        tableData,
        isDark,
        setDark,
        timeShortcuts,
        activeShortcut,
        reportDate,
        setActiveShortcut,
      };
    },
    template: `
      <div class="story-root vi-theme-scope component-matrix">
        <div class="regression-toolbar">
          <h3>组件样式回归</h3>
          <div class="toolbar-actions">
            <el-switch
              :model-value="isDark"
              inline-prompt
              active-text="暗"
              inactive-text="亮"
              @update:model-value="setDark"
            />
            <el-button type="primary" class="sb-no-flex-stretch" @click="drawerOpen = true">打开主题抽屉</el-button>
            <el-button class="sb-no-flex-stretch" @click="dialogOpen = true">打开弹窗</el-button>
          </div>
        </div>

        <div class="matrix-grid">
          <div class="matrix-card matrix-card--full">
            <h4>时间筛选条（原型还原）</h4>
            <div class="time-filter-bar">
              <el-radio-group v-model="period" class="dimension-radio-group">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>

              <div class="time-shortcut-group">
                <el-button
                  v-for="shortcut in timeShortcuts"
                  :key="shortcut.value"
                  :type="activeShortcut === shortcut.value ? 'primary' : 'default'"
                  class="shortcut-btn sb-no-flex-stretch"
                  @click="setActiveShortcut(shortcut.value)"
                >
                  {{ shortcut.label }}
                </el-button>
              </div>

              <el-date-picker
                v-model="reportDate"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                class="time-filter-bar__date date-picker-joined"
                placeholder="选择日期"
              />
            </div>
          </div>

          <div class="matrix-card">
            <h4>输入 / 选择</h4>
            <div class="line-gap">
              <el-input v-model="inputValue" class="date-picker-joined" />
              <el-select v-model="selectValue" style="width: 180px">
                <el-option
                  v-for="option in selectOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </div>
            <el-input v-model="textareaValue" type="textarea" :rows="3" />
          </div>

          <div class="matrix-card matrix-card--full">
            <h4>标签页 / 表格</h4>
            <el-tabs v-model="tabValue" class="workbench-tags-view__tabs">
              <el-tab-pane name="dashboard" label="数据驾驶舱" />
              <el-tab-pane name="report" label="用户模型运营报表" />
            </el-tabs>

            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column prop="game" label="游戏" />
              <el-table-column prop="revenue" label="收入" />
              <el-table-column prop="cost" label="消耗" />
              <el-table-column prop="roi" label="ROI" />
            </el-table>
          </div>
        </div>

        <el-dialog v-model="dialogOpen" title="弹窗样式回归" width="520px">
          <div class="line-gap">
            <el-input v-model="inputValue" />
            <el-select v-model="selectValue" style="width: 180px">
              <el-option
                v-for="option in selectOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
          <el-input v-model="textareaValue" type="textarea" :rows="4" />
          <template #footer>
            <el-button @click="dialogOpen = false">取消</el-button>
            <el-button type="primary" @click="dialogOpen = false">确认</el-button>
          </template>
        </el-dialog>

        <ThemeDrawer v-model:open="drawerOpen" />
      </div>
    `,
  }),
};

export const PrefixAndScopedOverride: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "回归场景：自定义 prefix 变量输出 + `.vi-theme-scope` 局部覆盖。",
      },
    },
  },
  render: () => ({
    setup() {
      initViTheme({ prefix: "brand" });
      const { setTheme, applyTheme } = useViTheme();
      const debug = ref({
        activePrefix: "",
        viColor: "",
        brandColor: "",
      });

      const localScopeStyle = {
        "--vi-color-primary": "#0ea5e9",
        "--vi-color-primary-rgb": "14, 165, 233",
        "--vi-tag-bg": "rgba(14, 165, 233, 0.12)",
        "--vi-tag-border": "rgba(14, 165, 233, 0.24)",
      } as CSSProperties;

      // 刷新调试信息，展示前缀和关键变量值。
      function refreshDebug(): void {
        const rootStyle = getComputedStyle(document.documentElement);
        debug.value = {
          activePrefix: document.documentElement.dataset.viPrefix ?? "vi",
          viColor: rootStyle.getPropertyValue("--vi-color-primary").trim(),
          brandColor: rootStyle
            .getPropertyValue("--brand-color-primary")
            .trim(),
        };
      }

      // 切换主题后等待 DOM 更新，再读取调试值。
      async function applyThemeAndRefresh(
        themeKey: ThemeColorKey,
      ): Promise<void> {
        setTheme(themeKey);
        await nextTick();
        refreshDebug();
      }

      onMounted(async () => {
        applyTheme();
        await nextTick();
        refreshDebug();
      });

      return {
        debug,
        localScopeStyle,
        applyThemeAndRefresh,
      };
    },
    template: `
      <div class="story-root">
        <div class="regression-toolbar">
          <h3>Prefix + 局部覆盖</h3>
          <div class="toolbar-actions">
            <el-button class="sb-no-flex-stretch" @click="applyThemeAndRefresh('teal')">Teal</el-button>
            <el-button class="sb-no-flex-stretch" @click="applyThemeAndRefresh('blue')">Blue</el-button>
          </div>
        </div>

        <p class="debug-line">
          activePrefix={{ debug.activePrefix }} / --vi-color-primary={{ debug.viColor }} / --brand-color-primary={{ debug.brandColor }}
        </p>

        <div class="scope-grid">
          <div class="scope-card vi-theme-scope">
            <h4>全局主题</h4>
            <el-button type="primary" class="sb-no-flex-stretch">主按钮</el-button>
            <div class="tag-demo">Tag 背景示例</div>
          </div>

          <div class="scope-card vi-theme-scope" :style="localScopeStyle">
            <h4>局部覆盖主题（仅此容器）</h4>
            <el-button type="primary" class="sb-no-flex-stretch">主按钮</el-button>
            <div class="tag-demo">Tag 背景示例</div>
          </div>
        </div>
      </div>
    `,
  }),
};
