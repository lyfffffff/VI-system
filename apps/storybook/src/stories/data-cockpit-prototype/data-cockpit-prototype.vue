<!-- 数据驾驶舱原型：Story 画布专用壳层，便于模板格式化与维护。 -->
<script setup lang="ts">
import { ref } from "vue";
import { initViTheme, ThemeDrawer, useViTheme } from "@yyxxfe/vi";
import AppHeader from "./app-header.vue";
import AppHistoryNav from "./app-history-nav.vue";
import AppMenu from "./app-menu.vue";
import ConditionsPanel from "./conditions-panel.vue";
import MetricsPanel from "./metrics-panel.vue";
import ChartPanel from "./chart-panel.vue";
import TablePanel from "./table-panel.vue";
import {
  cockpitDefaultHistoryTabs,
  cockpitNavItems,
} from "./mock-data";

const isRefreshing = ref(false);
const themeDrawerOpen = ref(false);
const isSidebarCollapsed = ref(false);
const conditionsPanelRef = ref<InstanceType<typeof ConditionsPanel> | null>(null);

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
  void conditionsPanelRef.value?.refreshData?.();
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
      <AppHeader
        :nav-items="navItems"
        :active-nav="activeNav"
        @update:active-nav="activeNav = $event"
        @open-theme-drawer="themeDrawerOpen = true"
        @toggle-dark="toggleDark"
      />

      <div class="workbench-shell__body">
        <AppMenu
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
            <AppHistoryNav
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
              <ConditionsPanel
                ref="conditionsPanelRef"
                v-model:is-refreshing="isRefreshing"
              />

              <MetricsPanel :is-refreshing="isRefreshing" />

              <ChartPanel />

              <TablePanel />
            </div>
          </main>
        </div>
      </div>
    </div>

    <ThemeDrawer v-model:open="themeDrawerOpen" />
  </div>
</template>

<style>
/* Story 画布：驾驶舱原型（原 `.storybook/story-styles/data-cockpit-prototype.stories.css`） */
.prototype-regression-story__toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.prototype-regression-story {
  min-height: 100vh;
}

.story-root.prototype-regression-story {
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

.story-root.prototype-regression-story .workbench-shell {
  height: 100%;
}
</style>
