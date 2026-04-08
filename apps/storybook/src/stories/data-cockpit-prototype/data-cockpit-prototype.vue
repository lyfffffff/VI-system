<!-- 数据驾驶舱原型：Story 画布专用壳层，便于模板格式化与维护。 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Refresh } from "@element-plus/icons-vue";
import { initViTheme, ThemeDrawer, useViTheme } from "@yyxxfe/vi";
import PrototypeHeader from "./prototype-header.vue";
import PrototypeHistoryTabs from "./prototype-history-tabs.vue";
import PrototypeMenu from "./prototype-menu.vue";
import PrototypeMetricsPanel from "./prototype-metrics-panel.vue";
import PrototypeTrendChartPanel from "./prototype-trend-chart-panel.vue";
import PrototypeGameOverviewTable from "./prototype-game-overview-table.vue";
import {
  cockpitAppTypeOptions,
  cockpitDefaultHistoryTabs,
  cockpitDistributionOptions,
  cockpitGameTreeData,
  cockpitNavItems,
} from "./mock-data";

const period = ref("day");
const shortcut = ref<"today" | "yesterday">("today");

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const now = new Date();
const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const reportDate = ref(todayString);
const distributionMethod = ref("all");
const selectedGame = ref("all");
const appType = ref("all");
const isRefreshing = ref(false);
const lastUpdateTime = ref(new Date());
const themeDrawerOpen = ref(false);
let clockTimer: number | undefined;
const isSidebarCollapsed = ref(false);

initViTheme();
const { setTheme, setDark, toggleDark, applyTheme } = useViTheme();
applyTheme();
setTheme("blue");
setDark(false);

const navItems = cockpitNavItems;
const activeNav = ref("analysis");
const activeMenuItem = ref("cockpit");

const defaultHistoryTabs = cockpitDefaultHistoryTabs;
const historyTabs = ref(defaultHistoryTabs.map((item) => ({ ...item })));
const activeHistoryTab = ref(historyTabs.value[0]?.key ?? "");

const gameTreeData = cockpitGameTreeData;
const distributionOptions = cockpitDistributionOptions;
const appTypeOptions = cockpitAppTypeOptions;

const dataFreshnessLabel = computed(() =>
  shortcut.value === "today" ? "实时" : "离线数据",
);
const freshnessTip = computed(() =>
  dataFreshnessLabel.value === "离线数据" ? "离线 T+1 更新" : "",
);
const formattedUpdateTime = computed(() => {
  const d = lastUpdateTime.value;
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
});

function setShortcut(value: "today" | "yesterday"): void {
  shortcut.value = value;
  const date = new Date();
  if (value === "yesterday") {
    date.setDate(date.getDate() - 1);
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
</script>

<template>
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

        <div class="workbench-main-wrapper">
          <section
            class="workbench-history-nav workbench-layout__tags-shell workbench-layout__glass-bar"
          >
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
          </section>
          <main class="workbench-main">
            <div class="cockpit-page workbench-main-flow">
              <section class="workbench-filter">
                <div class="workbench-filter__row">
                  <div class="workbench-filter__left">
                    <h2 class="workbench-filter__title">数据驾驶舱</h2>
                    <div class="workbench-filter__meta">
                      <span>更新于 {{ formattedUpdateTime }}</span>
                      <el-tooltip
                        :content="freshnessTip"
                        :disabled="dataFreshnessLabel === '实时'"
                        placement="bottom"
                      >
                        <span
                          class="workbench-filter__freshness cockpit-freshness-tag"
                          :class="
                            dataFreshnessLabel === '实时'
                              ? 'is-realtime'
                              : 'is-offline'
                          "
                        >
                          {{ dataFreshnessLabel }}
                        </span>
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
                        {{ isRefreshing ? "" : "刷新" }}
                      </el-button>
                    </div>
                  </div>

                  <div class="workbench-filter__right">
                    <el-radio-group
                      v-model="period"
                      class="dimension-radio-group"
                    >
                      <el-radio-button label="day">日</el-radio-button>
                      <el-radio-button label="week">周</el-radio-button>
                      <el-radio-button label="month">月</el-radio-button>
                      <el-radio-button label="year">年</el-radio-button>
                    </el-radio-group>

                    <div class="time-shortcut-group">
                      <el-button
                        class="shortcut-btn"
                        :type="shortcut === 'today' ? 'primary' : 'default'"
                        @click="setShortcut('today')"
                      >
                        今日
                      </el-button>
                      <el-button
                        class="shortcut-btn"
                        :type="shortcut === 'yesterday' ? 'primary' : 'default'"
                        @click="setShortcut('yesterday')"
                      >
                        昨日
                      </el-button>
                      <el-date-picker
                        v-model="reportDate"
                        type="date"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        class="date-picker-joined"
                      />
                    </div>

                    <el-select
                      v-model="distributionMethod"
                      style="width: 130px"
                      placeholder="发行方式"
                    >
                      <el-option
                        v-for="opt in distributionOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      />
                    </el-select>
                    <el-tree-select
                      v-model="selectedGame"
                      :data="gameTreeData"
                      check-strictly
                      :render-after-expand="false"
                      style="width: 180px"
                      placeholder="选择游戏"
                    />
                    <el-select
                      v-model="appType"
                      style="width: 120px"
                      placeholder="应用类型"
                    >
                      <el-option
                        v-for="opt in appTypeOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      />
                    </el-select>
                  </div>
                </div>
              </section>

              <PrototypeMetricsPanel :is-refreshing="isRefreshing" />

              <PrototypeTrendChartPanel />

              <PrototypeGameOverviewTable />
            </div>
          </main>
        </div>
      </div>
    </div>

    <ThemeDrawer v-model:open="themeDrawerOpen" />
  </div>
</template>
