<!-- 组件：侧边栏 -->
<template>
  <aside class="workbench-sidebar" :class="{ 'is-collapsed': collapsed }">
    <el-scrollbar class="workbench-sidebar__scroll">
      <el-menu
        ref="menuRef"
        :key="menuKey"
        mode="vertical"
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
import { Expand, Fold } from "@element-plus/icons-vue";
import type { MenuInstance } from "element-plus";
import { cockpitSidebarSectionsByNav } from "./mock-data";

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

const sections = computed(
  () =>
    cockpitSidebarSectionsByNav[props.activeTopNav] ??
    cockpitSidebarSectionsByNav.analysis,
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
