// 原型回归 Story：用于验证 data-cockpit 关键模块在主题系统下的视觉一致性。
import { computed, ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { ArrowDown, Operation, Refresh } from "@element-plus/icons-vue";
import { ThemeDrawer, THEME_PRESETS, useViTheme } from "@yyxxfe/vi";
import type { ThemeColorKey } from "@yyxxfe/vi";

interface IMetricCard {
  title: string;
  value: string;
  mom: string;
  yoy: string;
}

interface ITableRow {
  id: string;
  name: string;
  revenue: string;
  revenueMom: string;
  revenueYoy: string;
  cost: string;
  costMom: string;
  costYoy: string;
  roi: string;
  isProduct?: boolean;
}

const meta: Meta = {
  title: "Theme/Prototype Regression",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "高保真原型回归场景：导航、筛选条、指标卡、图表容器、表格、弹层。在亮/暗与多主题色下验证视觉契约。",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const DataCockpitPrototype: Story = {
  render: () => ({
    components: { ThemeDrawer, Refresh, Operation, ArrowDown },
    setup() {
      const drawerOpen = ref(false);
      const dialogOpen = ref(false);
      const period = ref("day");
      const shortcut = ref("today");
      const reportDate = ref("2026-03-30");
      const distributionMethod = ref("all");
      const selectedGame = ref("fumo-all");
      const appType = ref("all");
      const chartMetrics = ref<string[]>(["revenue", "cost"]);
      const compareGames = ref<string[]>(["all"]);
      const isRefreshing = ref(false);
      const lastUpdateTime = ref("14:32:18");
      const metricPageIndex = ref(0);

      const { themeKey, isDark, setTheme, setDark, applyTheme } = useViTheme({
        prefix: "vi",
      });
      applyTheme();

      const navItems = [
        { key: "ops", label: "经营分析" },
        { key: "game", label: "游戏分析" },
        { key: "market", label: "竞品监控" },
      ];
      const activeNav = ref("ops");

      const sidebarGroups = [
        {
          title: "数据模型",
          active: true,
          items: [
            { key: "forecast", label: "经营预测", active: false },
            { key: "income", label: "收入数据", active: true },
            { key: "analysis", label: "收入分析", active: false },
          ],
        },
        {
          title: "基础数据",
          active: false,
          items: [
            { key: "overview", label: "基础概览", active: false },
            { key: "new", label: "新增账号", active: false },
          ],
        },
      ];

      const tags = [
        { key: "cockpit", label: "数据驾驶舱", active: true },
        { key: "forecast", label: "经营预测", active: false },
        { key: "income", label: "收入数据", active: false },
      ];

      const metricPages: IMetricCard[][] = [
        [
          { title: "流水(元)", value: "757万", mom: "-19.9%", yoy: "-5.2%" },
          { title: "收入(元)", value: "530万", mom: "-18.5%", yoy: "-3.8%" },
          { title: "消耗(元)", value: "446万", mom: "-0.2%", yoy: "+2.1%" },
          { title: "销售毛利润(元)", value: "72万", mom: "+15.3%", yoy: "+8.5%" },
          { title: "首日ROI", value: "5.23%", mom: "-2.1%", yoy: "+1.2%" },
          { title: "注册单价(元)", value: "362.09", mom: "-3.5%", yoy: "-5.2%" },
        ],
        [
          { title: "新增账号", value: "41,250", mom: "+4.9%", yoy: "+8.3%" },
          { title: "活跃账号", value: "182,604", mom: "+1.7%", yoy: "+6.2%" },
          { title: "付费账号", value: "11,958", mom: "-0.6%", yoy: "+2.4%" },
          { title: "付费率", value: "6.55%", mom: "-0.2%", yoy: "+0.8%" },
          { title: "ARPU", value: "42.4", mom: "+3.1%", yoy: "+5.9%" },
          { title: "ARPPU", value: "646.1", mom: "+1.2%", yoy: "+3.3%" },
        ],
      ];

      const tableData: ITableRow[] = [
        {
          id: "p-fumo",
          name: "伏魔（产品）",
          revenue: "2,145,900",
          revenueMom: "+3.2%",
          revenueYoy: "+8.1%",
          cost: "1,302,420",
          costMom: "-1.2%",
          costYoy: "+2.9%",
          roi: "5.73%",
          isProduct: true,
        },
        {
          id: "g-fumo-cn",
          name: "伏魔-国内服",
          revenue: "1,092,301",
          revenueMom: "+1.8%",
          revenueYoy: "+4.6%",
          cost: "612,528",
          costMom: "-2.6%",
          costYoy: "+1.3%",
          roi: "5.21%",
        },
        {
          id: "g-fumo-oversea",
          name: "伏魔-海外服",
          revenue: "892,170",
          revenueMom: "-0.4%",
          revenueYoy: "+3.7%",
          cost: "502,120",
          costMom: "+1.2%",
          costYoy: "-0.8%",
          roi: "4.98%",
        },
      ];

      const gameTreeData = [
        {
          value: "all",
          label: "全部游戏",
          children: [
            { value: "fumo-all", label: "伏魔（全部版本）" },
            { value: "xianyu-all", label: "仙遇（全部版本）" },
          ],
        },
        {
          value: "fumo",
          label: "伏魔",
          children: [
            { value: "fumo-cn", label: "伏魔-国内服" },
            { value: "fumo-sea", label: "伏魔-海外服" },
          ],
        },
      ];

      const distributionOptions = [
        { label: "全部发行", value: "all" },
        { label: "自研发行", value: "self" },
        { label: "联运发行", value: "joint" },
      ];

      const appTypeOptions = [
        { label: "全部应用", value: "all" },
        { label: "iOS", value: "ios" },
        { label: "Android", value: "android" },
      ];

      const chartMetricOptions = [
        { label: "流水", value: "revenue" },
        { label: "收入", value: "income" },
        { label: "消耗", value: "cost" },
        { label: "毛利润", value: "profit" },
      ];

      const tableMetricTemplates = [
        { key: "system-default", label: "系统模板-核心指标" },
        { key: "system-growth", label: "系统模板-增长指标" },
        { key: "custom", label: "新建自定义指标" },
      ];

      const currentMetrics = computed(() => metricPages[metricPageIndex.value] ?? metricPages[0]);
      const hasMetricPages = computed(() => metricPages.length > 1);
      const dataFreshnessLabel = computed(() => (shortcut.value === "today" ? "实时" : "离线数据"));
      const freshnessTip = computed(() => (dataFreshnessLabel.value === "离线数据" ? "离线 T+1 更新" : ""));

      const themeOptions = computed(() =>
        THEME_PRESETS.map((item) => ({
          label: item.name,
          value: item.key,
        })),
      );

      function trendClass(value: string): string {
        return value.startsWith("+") ? "is-up" : "is-down";
      }

      async function refreshData(): Promise<void> {
        if (isRefreshing.value) return;
        isRefreshing.value = true;
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 650);
        });
        lastUpdateTime.value = "14:32:19";
        isRefreshing.value = false;
      }

      function rowTrendClass(value: string): string {
        return value.startsWith("+") ? "is-up" : "is-down";
      }

      function tableRowClassName({ row }: { row: ITableRow }): string {
        return row.isProduct ? "product-row" : "";
      }

      function changeTheme(value: ThemeColorKey): void {
        setTheme(value);
      }

      function handleMetricTemplateCommand(_command: string): void {
        // 回归场景仅用于展示 UI 形态，命令逻辑在业务项目验证。
      }

      return {
        drawerOpen,
        dialogOpen,
        period,
        shortcut,
        reportDate,
        distributionMethod,
        selectedGame,
        appType,
        chartMetrics,
        compareGames,
        isRefreshing,
        lastUpdateTime,
        metricPageIndex,
        themeKey,
        isDark,
        setDark,
        changeTheme,
        themeOptions,
        navItems,
        activeNav,
        sidebarGroups,
        tags,
        metricPages,
        currentMetrics,
        hasMetricPages,
        dataFreshnessLabel,
        freshnessTip,
        tableData,
        gameTreeData,
        distributionOptions,
        appTypeOptions,
        chartMetricOptions,
        tableMetricTemplates,
        trendClass,
        rowTrendClass,
        tableRowClassName,
        refreshData,
        handleMetricTemplateCommand,
      };
    },
    template: `
      <div class="story-root vi-theme-scope prototype-regression-story">
        <div class="prototype-regression-story__toolbar">
          <el-switch
            :model-value="isDark"
            inline-prompt
            active-text="暗"
            inactive-text="亮"
            @update:model-value="setDark"
          />
          <el-select :model-value="themeKey" style="width: 160px" @update:model-value="changeTheme">
            <el-option v-for="opt in themeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <el-button type="primary" class="sb-no-flex-stretch" @click="drawerOpen = true">主题设置</el-button>
          <el-button class="sb-no-flex-stretch" @click="dialogOpen = true">打开弹窗</el-button>
        </div>

        <div class="workbench-shell">
          <header class="workbench-topbar">
            <div class="workbench-topbar__left">
              <div class="workbench-topbar__brand">天问 · 数据平台</div>
              <nav class="workbench-topbar__nav">
                <button
                  v-for="item in navItems"
                  :key="item.key"
                  type="button"
                  class="workbench-topbar__nav-item"
                  :class="{ 'is-active': activeNav === item.key }"
                  @click="activeNav = item.key"
                >
                  {{ item.label }}
                </button>
              </nav>
            </div>
            <div class="workbench-topbar__actions">
              <el-button type="primary" class="sb-no-flex-stretch">AI助手</el-button>
              <el-avatar :size="30">D</el-avatar>
            </div>
          </header>

          <div class="workbench-shell__body">
            <aside class="workbench-sidebar">
              <div v-for="group in sidebarGroups" :key="group.title" style="margin-bottom: 10px;">
                <div class="workbench-sidebar__group-title" :class="{ 'has-active': group.active }">{{ group.title }}</div>
                <button
                  v-for="item in group.items"
                  :key="item.key"
                  type="button"
                  class="workbench-sidebar__item"
                  :class="{ 'is-active': item.active }"
                >
                  {{ item.label }}
                </button>
              </div>
            </aside>

            <main class="workbench-shell__main">
              <div class="workbench-tags-view">
                <button
                  v-for="tag in tags"
                  :key="tag.key"
                  type="button"
                  class="workbench-tag"
                  :class="{ 'is-active': tag.active }"
                >
                  {{ tag.label }}
                </button>
              </div>

              <section class="workbench-filter wb-soft-panel">
                <div class="workbench-filter__header">
                  <div>
                    <div class="workbench-filter__title">数据驾驶舱</div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px; color: var(--el-text-color-placeholder); font-size: 12px;">
                      <span>更新于 {{ lastUpdateTime }}</span>
                      <el-tooltip :content="freshnessTip" :disabled="dataFreshnessLabel === '实时'" placement="bottom">
                        <span
                          class="workbench-filter__selected-pill cockpit-freshness-tag"
                          :class="dataFreshnessLabel === '实时' ? 'is-realtime' : 'is-offline'"
                        >{{ dataFreshnessLabel }}</span>
                      </el-tooltip>
                      <el-button
                        v-if="shortcut === 'today'"
                        link
                        size="small"
                        :icon="Refresh"
                        :loading="isRefreshing"
                        @click="refreshData"
                      >
                        {{ isRefreshing ? '' : '刷新' }}
                      </el-button>
                    </div>
                  </div>

                  <div class="workbench-filter__actions">
                    <el-select v-model="distributionMethod" class="workbench-filter__field--rule" placeholder="发行方式">
                      <el-option v-for="opt in distributionOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                    </el-select>
                    <el-tree-select
                      v-model="selectedGame"
                      :data="gameTreeData"
                      check-strictly
                      :render-after-expand="false"
                      class="workbench-filter__field--game"
                      placeholder="选择游戏"
                    />
                    <el-select v-model="appType" class="workbench-filter__field--app" placeholder="应用类型">
                      <el-option v-for="opt in appTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                    </el-select>
                  </div>
                </div>

                <div class="workbench-filter__time-bar">
                  <el-radio-group v-model="period" class="dimension-radio-group">
                    <el-radio-button label="day">日</el-radio-button>
                    <el-radio-button label="week">周</el-radio-button>
                    <el-radio-button label="month">月</el-radio-button>
                    <el-radio-button label="year">年</el-radio-button>
                  </el-radio-group>

                  <div class="time-shortcut-group">
                    <el-button
                      class="shortcut-btn sb-no-flex-stretch"
                      :type="shortcut === 'today' ? 'primary' : 'default'"
                      @click="shortcut = 'today'"
                    >今日</el-button>
                    <el-button
                      class="shortcut-btn sb-no-flex-stretch"
                      :type="shortcut === 'yesterday' ? 'primary' : 'default'"
                      @click="shortcut = 'yesterday'"
                    >昨日</el-button>
                    <el-button
                      class="shortcut-btn sb-no-flex-stretch"
                      :type="shortcut === 'last7' ? 'primary' : 'default'"
                      @click="shortcut = 'last7'"
                    >近7天</el-button>
                  </div>

                  <el-date-picker
                    v-model="reportDate"
                    type="date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="date-picker-joined"
                  />
                </div>
              </section>

              <section class="workbench-metrics">
                <article v-for="(metric, index) in currentMetrics" :key="metric.title" class="workbench-metric-card" data-numeric="true">
                  <div class="workbench-metric-card__title">{{ metric.title }}</div>
                  <div class="workbench-metric-card__value" :class="{ 'value-updating': isRefreshing && index === 0 }">{{ metric.value }}</div>
                  <div class="workbench-metric-card__footer">
                    <span :class="['workbench-metric-card__trend', trendClass(metric.mom)]">环比 {{ metric.mom }}</span>
                    <span :class="['workbench-metric-card__trend', trendClass(metric.yoy)]">同比 {{ metric.yoy }}</span>
                  </div>
                </article>
              </section>

              <div v-if="hasMetricPages" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: -4px;">
                <span
                  v-for="(_page, index) in metricPages"
                  :key="index"
                  class="page-dot"
                  :class="{ active: metricPageIndex === index }"
                  @click="metricPageIndex = index"
                ></span>
              </div>

              <section class="workbench-chart-panel">
                <div class="workbench-chart-panel__header">
                  <h3 class="workbench-chart-panel__title">游戏趋势</h3>
                  <div class="workbench-filter__actions">
                    <el-select v-model="chartMetrics" multiple collapse-tags style="width: 190px;" placeholder="选择指标">
                      <el-option v-for="opt in chartMetricOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                    </el-select>
                    <el-tree-select
                      v-model="compareGames"
                      :data="gameTreeData"
                      :render-after-expand="false"
                      multiple
                      show-checkbox
                      check-on-click-node
                      collapse-tags
                      style="width: 260px;"
                      placeholder="选择游戏"
                    />
                  </div>
                </div>

                <div v-if="compareGames.length === 0" style="height: 270px; display: flex; align-items: center; justify-content: center;">
                  <el-empty description="请先选择游戏" />
                </div>

                <div v-else class="workbench-chart-mock">
                  <div class="workbench-chart-mock__line workbench-chart-mock__line--primary"></div>
                  <div class="workbench-chart-mock__line workbench-chart-mock__line--comparison"></div>
                  <div class="workbench-chart-mock__line workbench-chart-mock__line--accent"></div>
                </div>

                <div v-if="compareGames.length > 0" class="workbench-chart-panel__legend">
                  <span>伏魔主版本</span>
                  <span>仙遇主版本</span>
                  <span>源星战域</span>
                </div>
              </section>

              <section class="table-section wb-soft-panel" style="padding: 14px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <h3 style="margin: 0; color: var(--el-text-color-primary); font-size: 16px;">游戏概况</h3>
                  <el-dropdown trigger="hover" @command="handleMetricTemplateCommand">
                    <el-button :icon="Operation" class="metrics-dropdown-btn sb-no-flex-stretch">
                      自定义指标
                      <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          v-for="item in tableMetricTemplates"
                          :key="item.key"
                          :command="item.key"
                        >{{ item.label }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>

                <el-table :data="tableData" row-key="id" :row-class-name="tableRowClassName" style="width: 100%;">
                  <el-table-column prop="name" label="游戏" min-width="180" />

                  <el-table-column prop="revenue" align="right" min-width="120">
                    <template #header>
                      <el-tooltip content="流水：充值总额" placement="top">
                        <span class="tooltip-header">流水</span>
                      </el-tooltip>
                    </template>
                    <template #default="{ row }">
                      <span style="font-variant-numeric: tabular-nums;">{{ row.revenue }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="revenueMom" align="right" width="86">
                    <template #header><span style="font-size: 12px; color: var(--el-text-color-placeholder);">环</span></template>
                    <template #default="{ row }">
                      <span :style="{ color: rowTrendClass(row.revenueMom) === 'is-up' ? 'var(--wb-trend-up)' : 'var(--wb-success)' }">{{ row.revenueMom }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="revenueYoy" align="right" width="86">
                    <template #header><span style="font-size: 12px; color: var(--el-text-color-placeholder);">同</span></template>
                    <template #default="{ row }">
                      <span :style="{ color: rowTrendClass(row.revenueYoy) === 'is-up' ? 'var(--wb-trend-up)' : 'var(--wb-success)' }">{{ row.revenueYoy }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="cost" align="right" min-width="120">
                    <template #header>
                      <el-tooltip content="消耗：广告投放成本" placement="top">
                        <span class="tooltip-header">消耗</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>

                  <el-table-column prop="costMom" align="right" width="86">
                    <template #header><span style="font-size: 12px; color: var(--el-text-color-placeholder);">环</span></template>
                    <template #default="{ row }">
                      <span :style="{ color: rowTrendClass(row.costMom) === 'is-up' ? 'var(--wb-trend-up)' : 'var(--wb-success)' }">{{ row.costMom }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="costYoy" align="right" width="86">
                    <template #header><span style="font-size: 12px; color: var(--el-text-color-placeholder);">同</span></template>
                    <template #default="{ row }">
                      <span :style="{ color: rowTrendClass(row.costYoy) === 'is-up' ? 'var(--wb-trend-up)' : 'var(--wb-success)' }">{{ row.costYoy }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="roi" align="right" min-width="110">
                    <template #header>
                      <el-tooltip content="首日ROI：首日收入 / 消耗" placement="top">
                        <span class="tooltip-header">首日ROI</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </section>
            </main>
          </div>
        </div>

        <el-dialog v-model="dialogOpen" title="弹窗样式回归" width="520px">
          <el-input v-model="reportDate" />
          <template #footer>
            <div class="dialog-footer-actions">
              <el-button @click="dialogOpen = false">取消</el-button>
              <el-button type="primary" @click="dialogOpen = false">确认</el-button>
            </div>
          </template>
        </el-dialog>

        <ThemeDrawer v-model:open="drawerOpen" />
      </div>
    `,
  }),
};
