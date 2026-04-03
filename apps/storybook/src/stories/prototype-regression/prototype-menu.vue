<template>
  <aside class="workbench-sidebar" :class="{ 'is-collapsed': collapsed }">
    <el-scrollbar class="workbench-sidebar__scroll">
      <el-menu
        ref="menuRef"
        :key="menuKey"
        class="workbench-sidebar__menu"
        :default-active="activeItem"
        :default-openeds="openedSections"
        :collapse="collapsed"
        :collapse-transition="false"
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
      >
        <template v-for="section in sections" :key="section.key">
          <el-menu-item
            v-if="section.items.length === 0"
            :index="section.key"
            :title="section.title"
          >
            <el-icon class="workbench-sidebar__group-icon">
              <component :is="section.icon" />
            </el-icon>
            <template #title>
              <span class="workbench-sidebar__group-label">{{ section.title }}</span>
            </template>
          </el-menu-item>

          <el-sub-menu
            v-else
            :index="section.key"
            popper-class="workbench-sidebar__submenu-popper"
          >
            <template #title>
              <el-icon class="workbench-sidebar__group-icon">
                <component :is="section.icon" />
              </el-icon>
              <span class="workbench-sidebar__group-label">{{ section.title }}</span>
            </template>
            <el-menu-item
              v-for="item in section.items"
              :key="item.key"
              :index="item.key"
              :disabled="item.disabled"
            >
              {{ item.label }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>

    <div class="workbench-sidebar__toggle">
      <button
        type="button"
        class="workbench-sidebar__toggle-btn"
        :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
        @click="handleToggleCollapse"
      >
        <el-icon :size="16">
          <Expand v-if="collapsed" />
          <Fold v-else />
        </el-icon>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { DataAnalysis, Expand, Fold, Odometer, TrendCharts, Wallet } from "@element-plus/icons-vue";
import type { MenuInstance } from "element-plus";
import type { Component } from "vue";

interface SidebarItem {
  key: string;
  label: string;
  disabled?: boolean;
}

interface SidebarSection {
  key: string;
  title: string;
  icon: Component;
  items: SidebarItem[];
}

interface Props {
  activeTopNav: string;
  activeItem: string;
  collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
});

const emit = defineEmits<{
  select: [value: string];
  "toggle-collapse": [];
}>();

const collapsed = computed(() => props.collapsed);
const activeItem = computed(() => props.activeItem);
const menuRef = ref<MenuInstance>();
const openedSections = ref<string[]>([]);

const sectionsMap: Record<string, SidebarSection[]> = {
  analysis: [
    {
      key: "cockpit",
      title: "数据驾驶舱",
      icon: Odometer,
      items: [],
    },
    {
      key: "model",
      title: "数据模型",
      icon: TrendCharts,
      items: [{ key: "business-estimation", label: "经营预测" }],
    },
    {
      key: "finance",
      title: "财务分析",
      icon: Wallet,
      items: [
        { key: "revenue-data", label: "收入数据" },
        { key: "revenue-analysis", label: "收入分析" },
        { key: "share-config", label: "分成配置" },
        { key: "platform-daily", label: "财务日报" },
      ],
    },
    {
      key: "basic-data",
      title: "基础数据",
      icon: DataAnalysis,
      items: [
        { key: "basic-data-overview", label: "基础概览", disabled: true },
        { key: "basic-data-new-accounts", label: "新增账号", disabled: true },
        { key: "basic-data-revenue", label: "流水收入", disabled: true },
        { key: "basic-data-yearly-revenue", label: "年度收入", disabled: true },
      ],
    },
  ],
  game: [
    {
      key: "general",
      title: "通用分析",
      icon: DataAnalysis,
      items: [
        { key: "game-realtime", label: "实时数据" },
        { key: "game-periodic", label: "周月年表" },
        { key: "game-retention", label: "留存分析" },
        { key: "game-payment", label: "付费分析" },
        { key: "game-channel", label: "渠道分析" },
        { key: "game-ads", label: "广告分析" },
      ],
    },
  ],
  competitor: [
    {
      key: "ranking",
      title: "竞品监控",
      icon: DataAnalysis,
      items: [{ key: "competitor-ranking", label: "排行榜" }],
    },
  ],
};

const sections = computed(
  () => sectionsMap[props.activeTopNav] ?? sectionsMap.analysis,
);

const menuKey = computed(
  () => `${props.activeTopNav}-${collapsed.value ? "collapsed" : "expanded"}`,
);

function findParentSectionKey(itemKey: string): string | null {
  for (const section of sections.value) {
    if (section.items.some((item) => item.key === itemKey)) {
      return section.key;
    }
  }
  return null;
}

function syncOpenedSections(): void {
  const allExpandableSections = sections.value
    .filter((section) => section.items.length > 0)
    .map((section) => section.key);
  const activeParentKey = findParentSectionKey(activeItem.value);
  const merged = new Set([...allExpandableSections]);
  if (activeParentKey) {
    merged.add(activeParentKey);
  }
  openedSections.value = Array.from(merged);
}

function handleSelect(index: string): void {
  emit("select", index);
}

function handleOpen(index: string): void {
  if (!openedSections.value.includes(index)) {
    openedSections.value = [...openedSections.value, index];
  }
}

function handleClose(index: string): void {
  openedSections.value = openedSections.value.filter((key) => key !== index);
}

function handleToggleCollapse(): void {
  emit("toggle-collapse");
}

watch(
  () => props.activeTopNav,
  () => {
    syncOpenedSections();
  },
  { immediate: true },
);

watch(
  () => props.activeItem,
  async () => {
    const parentKey = findParentSectionKey(activeItem.value);
    if (!parentKey || collapsed.value) {
      return;
    }
    await nextTick();
    menuRef.value?.open(parentKey);
  },
  { immediate: true },
);
</script>
