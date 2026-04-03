// 原型回归 Story：用于验证 data-cockpit 关键模块在主题系统下的视觉一致性。
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { ArrowDown, ArrowRight, ArrowUp, Operation, Refresh } from "@element-plus/icons-vue";
import { initViTheme, ThemeDrawer, useViTheme } from "@yyxxfe/vi";
import PrototypeHeader from "./prototype-regression/prototype-header.vue";
import PrototypeHistoryTabs from "./prototype-regression/prototype-history-tabs.vue";
import PrototypeMenu from "./prototype-regression/prototype-menu.vue";

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
  income: string;
  cost: string;
  costMom: string;
  costYoy: string;
  grossProfit: string;
  firstDayRoi: string;
  registerUnitPrice: string;
  newAccounts: string;
  activeAccounts: string;
  paidAccounts: string;
  payRate: string;
  arppu: string;
  isSummary?: boolean;
}

const meta: Meta = {
  title: "主题/原型回归",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
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
  name: "数据驾驶舱原型",
  render: () => ({
    components: {
      Refresh,
      Operation,
      ArrowDown,
      ArrowRight,
      ArrowUp,
      ThemeDrawer,
      PrototypeHeader,
      PrototypeMenu,
      PrototypeHistoryTabs,
    },
    setup() {
      const dialogOpen = ref(false);
      const period = ref("day");
      const shortcut = ref("today");
      const now = new Date();
      function formatDate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
      const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate(),
      ).padStart(2, "0")}`;
      const reportDate = ref(todayString);
      const distributionMethod = ref("all");
      const selectedGame = ref("all");
      const appType = ref("all");
      const chartMetrics = ref<string[]>(["revenue"]);
      const compareGames = ref<string[]>(["fumo-main", "xianyu-main", "origin-main"]);
      const isRefreshing = ref(false);
      const lastUpdateTime = ref(new Date());
      const themeDrawerOpen = ref(false);
      let clockTimer: number | undefined;
      const metricPageIndex = ref(0);
      const isSidebarCollapsed = ref(false);

      initViTheme({ prefix: "vi" });
      const { setTheme, setDark, toggleDark, applyTheme } = useViTheme();
      applyTheme();
      setTheme("blue");
      setDark(false);

      const navItems = [
        { key: "analysis", label: "经营分析" },
        { key: "game", label: "游戏分析" },
        { key: "competitor", label: "竞品监控" },
      ];
      const activeNav = ref("analysis");
      const activeMenuItem = ref("cockpit");

      const defaultHistoryTabs = [
        { key: "cockpit", label: "数据驾驶舱", closable: true },
      ];
      const historyTabs = ref(defaultHistoryTabs.map((item) => ({ ...item })));
      const activeHistoryTab = ref(historyTabs.value[0]?.key ?? "");

      const firstMetricPage: IMetricCard[] = [
        { title: "流水(元)", value: "758万", mom: "-19.9%", yoy: "-5.2%" },
        { title: "收入(元)", value: "531万", mom: "-18.5%", yoy: "-3.8%" },
        { title: "消耗(元)", value: "447万", mom: "-0.2%", yoy: "+2.1%" },
        { title: "销售毛利润(元)", value: "72万", mom: "+15.3%", yoy: "+8.5%" },
        { title: "首日ROI", value: "5.24%", mom: "-2.1%", yoy: "+1.2%" },
        { title: "注册单价(元)", value: "362.09", mom: "-3.5%", yoy: "-5.2%" },
        { title: "新增账号", value: "1.23万", mom: "+8.3%", yoy: "+12.5%" },
        { title: "DAU", value: "4.57万", mom: "+5.2%", yoy: "+3.8%" },
        { title: "付费账号", value: "2,856", mom: "+12.8%", yoy: "+8.5%" },
        { title: "付费率", value: "6.25%", mom: "+7.2%", yoy: "+4.5%" },
        { title: "ARPU(元)", value: "165.94", mom: "-2.5%", yoy: "-1.2%" },
        { title: "ARPPU(元)", value: "2,654.06", mom: "-8.6%", yoy: "-5.3%" },
      ];

      const metricPages: IMetricCard[][] = [firstMetricPage, firstMetricPage];

      const tableData: ITableRow[] = [
        {
          id: "summary",
          name: "合计(共 6 个产品)",
          revenue: "600",
          revenueMom: "-0.6%",
          revenueYoy: "+4%",
          income: "413",
          cost: "322",
          costMom: "+0.6%",
          costYoy: "+4.4%",
          grossProfit: "132",
          firstDayRoi: "143%",
          registerUnitPrice: "¥36.2",
          newAccounts: "11,777",
          activeAccounts: "29,443",
          paidAccounts: "1,767",
          payRate: "6.25%",
          arppu: "¥234",
          isSummary: true,
        },
        {
          id: "fumo",
          name: "伏魔",
          revenue: "311",
          revenueMom: "-2.1%",
          revenueYoy: "+5.2%",
          income: "217",
          cost: "115",
          costMom: "+4.8%",
          costYoy: "+6.2%",
          grossProfit: "110",
          firstDayRoi: "152%",
          registerUnitPrice: "¥36.2",
          newAccounts: "4,136",
          activeAccounts: "10,340",
          paidAccounts: "620",
          payRate: "6.25%",
          arppu: "¥315",
        },
        {
          id: "xianyu",
          name: "仙遇",
          revenue: "159",
          revenueMom: "+3.5%",
          revenueYoy: "-1.8%",
          income: "110",
          cost: "90",
          costMom: "-2.3%",
          costYoy: "+8.1%",
          grossProfit: "45",
          firstDayRoi: "141%",
          registerUnitPrice: "¥36.2",
          newAccounts: "3,430",
          activeAccounts: "8,575",
          paidAccounts: "515",
          payRate: "6.25%",
          arppu: "¥213",
        },
        {
          id: "qingyunjue2",
          name: "青云诀2",
          revenue: "86",
          revenueMom: "-5.2%",
          revenueYoy: "+12.5%",
          income: "56",
          cost: "42",
          costMom: "+1.2%",
          costYoy: "-3.5%",
          grossProfit: "16",
          firstDayRoi: "135%",
          registerUnitPrice: "¥36.2",
          newAccounts: "2,285",
          activeAccounts: "5,713",
          paidAccounts: "343",
          payRate: "6.25%",
          arppu: "¥163",
        },
        {
          id: "originwar",
          name: "源星战域",
          revenue: "19",
          revenueMom: "+8.3%",
          revenueYoy: "-4.2%",
          income: "13",
          cost: "38",
          costMom: "-6.1%",
          costYoy: "+2.8%",
          grossProfit: "-23",
          firstDayRoi: "154%",
          registerUnitPrice: "¥36.2",
          newAccounts: "856",
          activeAccounts: "2,140",
          paidAccounts: "128",
          payRate: "6.25%",
          arppu: "¥102",
        },
        {
          id: "swordrecord",
          name: "御剑封神录",
          revenue: "15",
          revenueMom: "-1.5%",
          revenueYoy: "+7.8%",
          income: "10",
          cost: "22",
          costMom: "+3.2%",
          costYoy: "-5.3%",
          grossProfit: "-10",
          firstDayRoi: "130%",
          registerUnitPrice: "¥36.2",
          newAccounts: "620",
          activeAccounts: "1,550",
          paidAccounts: "93",
          payRate: "6.25%",
          arppu: "¥95",
        },
        {
          id: "qingyunchuan",
          name: "青云传",
          revenue: "10",
          revenueMom: "+4.2%",
          revenueYoy: "-2.5%",
          income: "7",
          cost: "15",
          costMom: "-1.8%",
          costYoy: "+9.2%",
          grossProfit: "-6",
          firstDayRoi: "110%",
          registerUnitPrice: "¥36.2",
          newAccounts: "450",
          activeAccounts: "1,125",
          paidAccounts: "68",
          payRate: "6.25%",
          arppu: "¥88",
        },
      ];

      const gameTreeData = [
        {
          value: "all",
          label: "全部游戏",
          children: [
            { value: "fumo-cn", label: "伏魔主版本" },
            { value: "xianyu-cn", label: "仙遇主版本" },
            { value: "origin-cn", label: "源星战域" },
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
        {
          value: "xianyu",
          label: "仙遇",
          children: [
            { value: "xianyu-cn", label: "仙遇-国内服" },
          ],
        },
        {
          value: "origin",
          label: "源星战域",
          children: [
            { value: "origin-cn", label: "源星战域-国内服" },
          ],
        },
      ];

      const trendGameTreeData = [
        {
          value: "all",
          label: "全部游戏",
          children: [
            { value: "fumo-main", label: "伏魔主版本" },
            { value: "xianyu-main", label: "仙遇主版本" },
            { value: "origin-main", label: "源星战域" },
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
      const formattedUpdateTime = computed(() => {
        const d = lastUpdateTime.value;
        const h = String(d.getHours()).padStart(2, "0");
        const m = String(d.getMinutes()).padStart(2, "0");
        const s = String(d.getSeconds()).padStart(2, "0");
        return `${h}:${m}:${s}`;
      });

      function trendClass(value: string): string {
        return value.startsWith("+") ? "is-up" : "is-down";
      }

      function trendText(value: string): string {
        return value.replace(/^[+-]/, "");
      }

      function setShortcut(value: "today" | "yesterday" | "last7"): void {
        shortcut.value = value;
        const date = new Date();
        if (value === "yesterday") {
          date.setDate(date.getDate() - 1);
        } else if (value === "last7") {
          date.setDate(date.getDate() - 6);
        }
        reportDate.value = formatDate(date);
      }

      async function refreshData(): Promise<void> {
        if (isRefreshing.value) return;
        isRefreshing.value = true;
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 650);
        });
        lastUpdateTime.value = new Date();
        isRefreshing.value = false;
      }

      onMounted(() => {
        clockTimer = window.setInterval(() => {
          if (shortcut.value === "today") {
            lastUpdateTime.value = new Date();
          }
        }, 1000);
      });

      onBeforeUnmount(() => {
        if (clockTimer) {
          window.clearInterval(clockTimer);
        }
      });

      function rowTrendClass(value: string): string {
        return value.startsWith("+") ? "is-up" : "is-down";
      }

      function tableRowClassName({ row }: { row: ITableRow }): string {
        return row.isSummary ? "product-row" : "";
      }

      function handleMetricTemplateCommand(_command: string): void {
        // 回归场景仅用于展示 UI 形态，命令逻辑在业务项目验证。
      }

      function handleHistoryTabClose(value: string): void {
        const index = historyTabs.value.findIndex((item) => item.key === value);
        if (index < 0) return;

        historyTabs.value.splice(index, 1);

        if (activeHistoryTab.value === value) {
          const fallback =
            historyTabs.value[index - 1] ??
            historyTabs.value[index] ??
            historyTabs.value[0];
          activeHistoryTab.value = fallback?.key ?? "";
        }
      }

      function handleHistoryTabRefresh(value: string): void {
        if (!value) return;
        activeHistoryTab.value = value;
        void refreshData();
      }

      function handleHistoryTabCloseOthers(value: string): void {
        if (!value) return;
        const current = historyTabs.value.find((item) => item.key === value);
        historyTabs.value = current ? [current] : [];
        activeHistoryTab.value = current?.key ?? "";
      }

      function handleHistoryTabCloseLeft(value: string): void {
        const index = historyTabs.value.findIndex((item) => item.key === value);
        if (index <= 0) return;
        historyTabs.value = historyTabs.value.slice(index);
        if (!historyTabs.value.some((item) => item.key === activeHistoryTab.value)) {
          activeHistoryTab.value = historyTabs.value[0]?.key ?? "";
        }
      }

      function handleHistoryTabCloseRight(value: string): void {
        const index = historyTabs.value.findIndex((item) => item.key === value);
        if (index < 0 || index >= historyTabs.value.length - 1) return;
        historyTabs.value = historyTabs.value.slice(0, index + 1);
        if (!historyTabs.value.some((item) => item.key === activeHistoryTab.value)) {
          activeHistoryTab.value =
            historyTabs.value[historyTabs.value.length - 1]?.key ?? "";
        }
      }

      function handleHistoryTabCloseAll(): void {
        const fallbackTab = defaultHistoryTabs[0];
        historyTabs.value = fallbackTab ? [{ ...fallbackTab }] : [];
        activeHistoryTab.value = fallbackTab?.key ?? "";
      }

      return {
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
        themeDrawerOpen,
        formattedUpdateTime,
        metricPageIndex,
        isSidebarCollapsed,
        navItems,
        activeNav,
        activeMenuItem,
        historyTabs,
        activeHistoryTab,
        metricPages,
        currentMetrics,
        hasMetricPages,
        dataFreshnessLabel,
        freshnessTip,
        tableData,
        gameTreeData,
        trendGameTreeData,
        distributionOptions,
        appTypeOptions,
        chartMetricOptions,
        tableMetricTemplates,
        trendClass,
        trendText,
        setShortcut,
        rowTrendClass,
        tableRowClassName,
        refreshData,
        handleMetricTemplateCommand,
        handleHistoryTabClose,
        handleHistoryTabRefresh,
        handleHistoryTabCloseOthers,
        handleHistoryTabCloseLeft,
        handleHistoryTabCloseRight,
        handleHistoryTabCloseAll,
      };
    },
    template: `
      <div class="story-root vi-theme-scope prototype-regression-story">
        <div class="workbench-shell">
          <PrototypeHeader
            :nav-items="navItems"
            :active-nav="activeNav"
            @update:active-nav="activeNav = $event"
            @open-theme-drawer="themeDrawerOpen = true"
            @toggle-dark="toggleDark"
          />

          <div class="workbench-shell__body">
            <PrototypeMenu
              :active-top-nav="activeNav"
              :active-item="activeMenuItem"
              :collapsed="isSidebarCollapsed"
              @select="activeMenuItem = $event"
              @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
            />

            <main class="workbench-shell__main">
              <div class="workbench-layout__tags-shell workbench-layout__glass-bar">
                <PrototypeHistoryTabs
                  :tabs="historyTabs"
                  :active-tab="activeHistoryTab"
                  @update:active-tab="activeHistoryTab = $event"
                  @close-tab="handleHistoryTabClose"
                  @refresh-tab="handleHistoryTabRefresh"
                  @close-other-tabs="handleHistoryTabCloseOthers"
                  @close-left-tabs="handleHistoryTabCloseLeft"
                  @close-right-tabs="handleHistoryTabCloseRight"
                  @close-all-tabs="handleHistoryTabCloseAll"
                />
              </div>
              <div class="cockpit-page">
                <section class="workbench-filter">
                  <div class="workbench-filter__row">
                    <div class="workbench-filter__left">
                      <h2 class="workbench-filter__title">数据驾驶舱</h2>
                      <div class="workbench-filter__meta">
                        <span>更新于 {{ formattedUpdateTime }}</span>
                        <el-tooltip :content="freshnessTip" :disabled="dataFreshnessLabel === '实时'" placement="bottom">
                          <span
                            class="workbench-filter__freshness cockpit-freshness-tag"
                            :class="dataFreshnessLabel === '实时' ? 'is-realtime' : 'is-offline'"
                          >{{ dataFreshnessLabel }}</span>
                        </el-tooltip>
                        <el-button
                          v-if="shortcut === 'today'"
                          link
                          size="small"
                          :icon="Refresh"
                          :loading="isRefreshing"
                          class="workbench-filter__refresh-btn"
                          @click="refreshData"
                        >
                          {{ isRefreshing ? '' : '刷新' }}
                        </el-button>
                      </div>
                    </div>

                    <div class="workbench-filter__right">
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
                          @click="setShortcut('today')"
                        >今日</el-button>
                        <el-button
                          class="shortcut-btn sb-no-flex-stretch"
                          :type="shortcut === 'yesterday' ? 'primary' : 'default'"
                          @click="setShortcut('yesterday')"
                        >昨日</el-button>
                        <el-date-picker
                          v-model="reportDate"
                          type="date"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD"
                          class="date-picker-joined"
                        />
                      </div>

                      <el-select v-model="distributionMethod" style="width: 130px;" placeholder="发行方式">
                        <el-option v-for="opt in distributionOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                      </el-select>
                      <el-tree-select
                        v-model="selectedGame"
                        :data="gameTreeData"
                        check-strictly
                        :render-after-expand="false"
                        style="width: 180px;"
                        placeholder="选择游戏"
                      />
                      <el-select v-model="appType" style="width: 120px;" placeholder="应用类型">
                        <el-option v-for="opt in appTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                      </el-select>
                    </div>
                  </div>
                </section>

                <div class="workbench-metrics-shell">
                  <section class="workbench-metrics wb-stat-grid">
                    <article v-for="(metric, index) in currentMetrics" :key="metric.title" class="workbench-metric-card wb-stat-card" data-numeric="true">
                      <div class="workbench-metric-card__title wb-stat-card__title">{{ metric.title }}</div>
                      <div class="workbench-metric-card__value wb-stat-card__value" :class="{ 'value-updating': isRefreshing && index === 0 }">{{ metric.value }}</div>
                      <div class="workbench-metric-card__footer wb-stat-card__footer">
                        <span class="workbench-metric-card__trend wb-stat-card__trend">
                          <span class="workbench-metric-card__trend-label">环比</span>
                          <span :class="['workbench-metric-card__trend-value', trendClass(metric.mom)]">
                            <el-icon :size="12">
                              <ArrowUp v-if="metric.mom.startsWith('+')" />
                              <ArrowDown v-else />
                            </el-icon>
                            {{ trendText(metric.mom) }}
                          </span>
                        </span>
                        <span class="workbench-metric-card__trend wb-stat-card__trend">
                          <span class="workbench-metric-card__trend-label">同比</span>
                          <span :class="['workbench-metric-card__trend-value', trendClass(metric.yoy)]">
                            <el-icon :size="12">
                              <ArrowUp v-if="metric.yoy.startsWith('+')" />
                              <ArrowDown v-else />
                            </el-icon>
                            {{ trendText(metric.yoy) }}
                          </span>
                        </span>
                      </div>
                    </article>
                  </section>

                  <div v-if="hasMetricPages" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px;">
                    <span
                      v-for="(_page, index) in metricPages"
                      :key="index"
                      class="page-dot"
                      :class="{ active: metricPageIndex === index }"
                      @click="metricPageIndex = index"
                    ></span>
                  </div>
                </div>

                <section class="workbench-chart-panel wb-chart-shell">
                  <div class="workbench-chart-panel__header wb-chart-shell__header">
                    <h3 class="workbench-chart-panel__title wb-chart-shell__title">游戏趋势</h3>
                    <div class="workbench-filter__actions wb-query-panel__actions">
                      <el-select v-model="chartMetrics" multiple collapse-tags style="width: 180px;" placeholder="选择指标">
                        <el-option v-for="opt in chartMetricOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                      </el-select>
                      <el-tree-select
                        v-model="compareGames"
                        :data="trendGameTreeData"
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

                  <div v-if="compareGames.length === 0" class="wb-chart-shell__body-empty">
                    <el-empty description="请先选择游戏" />
                  </div>

                  <div v-else class="workbench-chart-mock">
                    <svg class="workbench-chart-mock__svg" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
                      <g class="workbench-chart-mock__grid">
                        <line x1="42" y1="24" x2="972" y2="24" />
                        <line x1="42" y1="70" x2="972" y2="70" />
                        <line x1="42" y1="116" x2="972" y2="116" />
                        <line x1="42" y1="162" x2="972" y2="162" />
                        <line x1="42" y1="208" x2="972" y2="208" />
                        <line x1="42" y1="254" x2="972" y2="254" />
                      </g>
                      <path
                        class="workbench-chart-mock__area workbench-chart-mock__area--primary"
                        d="M106,63 C152,75 198,96 245,98 C291,100 338,108 385,105 C431,102 477,91 524,85 C570,79 617,46 664,40 C710,34 756,70 803,77 C849,84 895,62 942,55 L942,254 L106,254 Z"
                      />
                      <path
                        class="workbench-chart-mock__area workbench-chart-mock__area--comparison"
                        d="M106,155 C152,164 198,182 245,183 C291,184 338,168 385,166 C431,164 477,166 524,166 C570,166 617,156 664,158 C710,160 756,185 803,182 C849,179 895,162 942,158 L942,254 L106,254 Z"
                      />
                      <path
                        class="workbench-chart-mock__line workbench-chart-mock__line--primary"
                        d="M106,63 C152,75 198,96 245,98 C291,100 338,108 385,105 C431,102 477,91 524,85 C570,79 617,46 664,40 C710,34 756,70 803,77 C849,84 895,62 942,55"
                      />
                      <path
                        class="workbench-chart-mock__line workbench-chart-mock__line--comparison"
                        d="M106,155 C152,164 198,182 245,183 C291,184 338,168 385,166 C431,164 477,166 524,166 C570,166 617,156 664,158 C710,160 756,185 803,182 C849,179 895,162 942,158"
                      />
                      <path
                        class="workbench-chart-mock__line workbench-chart-mock__line--accent"
                        d="M106,239 C152,239 198,238 245,238 C291,238 338,236 385,236 C431,236 477,236 524,236 C570,236 617,236 664,236 C710,236 756,235 803,234 C849,233 895,230 942,229"
                      />
                      <g class="workbench-chart-mock__nodes workbench-chart-mock__nodes--primary">
                        <circle cx="106" cy="63" r="2.6" />
                        <circle cx="245" cy="98" r="2.6" />
                        <circle cx="385" cy="105" r="2.6" />
                        <circle cx="524" cy="85" r="2.6" />
                        <circle cx="664" cy="40" r="2.6" />
                        <circle cx="803" cy="77" r="2.6" />
                        <circle cx="942" cy="55" r="2.6" />
                      </g>
                      <g class="workbench-chart-mock__nodes workbench-chart-mock__nodes--comparison">
                        <circle cx="106" cy="155" r="2.4" />
                        <circle cx="245" cy="183" r="2.4" />
                        <circle cx="385" cy="166" r="2.4" />
                        <circle cx="524" cy="166" r="2.4" />
                        <circle cx="664" cy="158" r="2.4" />
                        <circle cx="803" cy="182" r="2.4" />
                        <circle cx="942" cy="158" r="2.4" />
                      </g>
                      <g class="workbench-chart-mock__nodes workbench-chart-mock__nodes--accent">
                        <circle cx="106" cy="239" r="2.3" />
                        <circle cx="245" cy="238" r="2.3" />
                        <circle cx="385" cy="236" r="2.3" />
                        <circle cx="524" cy="236" r="2.3" />
                        <circle cx="664" cy="236" r="2.3" />
                        <circle cx="803" cy="234" r="2.3" />
                        <circle cx="942" cy="229" r="2.3" />
                      </g>
                      <g class="workbench-chart-mock__milestones">
                        <circle cx="385" cy="105" r="4.5" />
                        <text x="385" y="89">大推</text>
                        <circle cx="664" cy="158" r="4.5" />
                        <text x="664" y="142">周年庆</text>
                        <circle cx="245" cy="238" r="4.5" class="is-accent" />
                        <text x="245" y="222" class="is-accent">首发</text>
                      </g>
                    </svg>
                    <div class="workbench-chart-mock__y-axis">
                      <span>1000万</span>
                      <span>800万</span>
                      <span>600万</span>
                      <span>400万</span>
                      <span>200万</span>
                      <span>0万</span>
                    </div>
                    <div class="workbench-chart-mock__x-axis">
                      <span>3/27</span>
                      <span>3/28</span>
                      <span>3/29</span>
                      <span>3/30</span>
                      <span>3/31</span>
                      <span>4/1</span>
                      <span>4/2</span>
                    </div>
                  </div>

                  <div v-if="compareGames.length > 0" class="workbench-chart-panel__legend wb-chart-shell__legend">
                    <span class="workbench-chart-panel__legend-item"><i class="is-primary"></i>伏魔主版本</span>
                    <span class="workbench-chart-panel__legend-item"><i class="is-comparison"></i>仙遇主版本</span>
                    <span class="workbench-chart-panel__legend-item"><i class="is-accent"></i>源星战域</span>
                  </div>
                </section>

                <section class="table-section wb-table-panel wb-soft-panel">
                  <div class="wb-table-panel__header">
                    <h3 class="wb-table-panel__title">游戏概况</h3>
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

                  <el-table
                    :data="tableData"
                    row-key="id"
                    :row-class-name="tableRowClassName"
                    style="width: 100%; min-width: 1740px;"
                  >
                    <el-table-column prop="name" label="游戏" min-width="168">
                      <template #header>
                        <span class="workbench-table-name workbench-table-name--header">
                          <el-icon class="workbench-table-name__chevron"><ArrowRight /></el-icon>
                          <span>游戏</span>
                        </span>
                      </template>
                      <template #default="{ row }">
                        <span class="workbench-table-name">
                          <el-icon v-if="!row.isSummary" class="workbench-table-name__chevron"><ArrowRight /></el-icon>
                          <span>{{ row.name }}</span>
                        </span>
                      </template>
                    </el-table-column>

                    <el-table-column prop="revenue" label="流水" align="right" min-width="86" sortable="custom" />
                    <el-table-column prop="revenueMom" label="环" align="right" width="74">
                      <template #default="{ row }">
                        <span :class="rowTrendClass(row.revenueMom) === 'is-up' ? 'wb-table-trend--up' : 'wb-table-trend--down'">{{ row.revenueMom }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="revenueYoy" label="同" align="right" width="74">
                      <template #default="{ row }">
                        <span :class="rowTrendClass(row.revenueYoy) === 'is-up' ? 'wb-table-trend--up' : 'wb-table-trend--down'">{{ row.revenueYoy }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column prop="income" label="收入" align="right" min-width="86" sortable="custom" />
                    <el-table-column prop="cost" label="消耗" align="right" min-width="86" sortable="custom" />
                    <el-table-column prop="costMom" label="环" align="right" width="74">
                      <template #default="{ row }">
                        <span :class="rowTrendClass(row.costMom) === 'is-up' ? 'wb-table-trend--up' : 'wb-table-trend--down'">{{ row.costMom }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="costYoy" label="同" align="right" width="74">
                      <template #default="{ row }">
                        <span :class="rowTrendClass(row.costYoy) === 'is-up' ? 'wb-table-trend--up' : 'wb-table-trend--down'">{{ row.costYoy }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column prop="grossProfit" label="销售毛利润" align="right" min-width="112" sortable="custom" />
                    <el-table-column prop="firstDayRoi" label="首日ROI" align="right" min-width="96" sortable="custom" />
                    <el-table-column prop="registerUnitPrice" label="注册单价" align="right" min-width="112" sortable="custom" />
                    <el-table-column prop="newAccounts" label="新增账号" align="right" min-width="102" sortable="custom" />
                    <el-table-column prop="activeAccounts" label="活跃账号" align="right" min-width="102" sortable="custom" />
                    <el-table-column prop="paidAccounts" label="付费账号" align="right" min-width="102" sortable="custom" />
                    <el-table-column prop="payRate" label="付费率" align="right" min-width="88" sortable="custom" />
                    <el-table-column prop="arppu" label="ARPPU" align="right" min-width="92" sortable="custom" />
                  </el-table>
                </section>
              </div>
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

        <ThemeDrawer v-model:open="themeDrawerOpen" />

      </div>
    `,
  }),
};
