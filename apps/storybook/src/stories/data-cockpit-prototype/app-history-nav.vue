<!-- 组件：历史标签导航 -->
<template>
  <div class="workbench-tags-view">
    <el-tabs
      :model-value="activeTab"
      type="card"
      class="workbench-tags-view__tabs"
      @update:model-value="handleTabChange"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="(tab, index) in tabs"
        :key="tab.key"
        :name="tab.key"
        :closable="showClose && tab.closable !== false"
      >
        <template #label>
          <div
            class="workbench-tags-view__label-wrap"
            @contextmenu="handleContextMenu($event, tab.key, index)"
          >
            <span class="workbench-tags-view__label">{{ tab.label }}</span>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>

    <Teleport to="body">
      <div
        v-if="contextMenuVisible"
        class="workbench-tags-context-menu"
        :style="{
          left: `${contextMenuPosition.left}px`,
          top: `${contextMenuPosition.top}px`,
        }"
      >
        <button
          type="button"
          class="workbench-tags-context-menu__item"
          @click="handleRefreshCurrent"
        >
          <el-icon><Refresh /></el-icon>
          <span>重新刷新</span>
        </button>
        <button
          type="button"
          class="workbench-tags-context-menu__item"
          @click="handleCloseCurrent"
        >
          <el-icon><Close /></el-icon>
          <span>关闭当前</span>
        </button>
        <button
          type="button"
          class="workbench-tags-context-menu__item"
          :class="{ 'is-disabled': !canCloseOthers }"
          @click="canCloseOthers && handleCloseOthers()"
        >
          <el-icon><Remove /></el-icon>
          <span>关闭其他</span>
        </button>
        <button
          type="button"
          class="workbench-tags-context-menu__item"
          :class="{ 'is-disabled': !canCloseLeft }"
          @click="canCloseLeft && handleCloseLeft()"
        >
          <el-icon><Back /></el-icon>
          <span>关闭左侧</span>
        </button>
        <button
          type="button"
          class="workbench-tags-context-menu__item"
          :class="{ 'is-disabled': !canCloseRight }"
          @click="canCloseRight && handleCloseRight()"
        >
          <el-icon><Right /></el-icon>
          <span>关闭右侧</span>
        </button>
        <button
          type="button"
          class="workbench-tags-context-menu__item"
          @click="handleCloseAll"
        >
          <el-icon><Remove /></el-icon>
          <span>关闭所有</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { Back, Close, Refresh, Remove, Right } from "@element-plus/icons-vue";
import type { TabPaneName } from "element-plus";

interface HistoryTabItem {
  key: string;
  label: string;
  closable?: boolean;
}

interface Props {
  tabs: HistoryTabItem[];
  activeTab: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:activeTab": [value: string];
  "close-tab": [value: string];
  "refresh-tab": [value: string];
  "close-other-tabs": [value: string];
  "close-left-tabs": [value: string];
  "close-right-tabs": [value: string];
  "close-all-tabs": [];
}>();

const showClose = computed(() => props.tabs.length > 1);
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ left: 0, top: 0 });
const contextMenuKey = ref("");
const contextMenuIndex = ref(-1);
const canCloseOthers = computed(() => props.tabs.length > 1);
const canCloseLeft = computed(() => contextMenuIndex.value > 0);
const canCloseRight = computed(
  () =>
    contextMenuIndex.value > -1 &&
    contextMenuIndex.value < props.tabs.length - 1,
);

function handleTabChange(value: TabPaneName): void {
  emit("update:activeTab", String(value));
}

function handleTabRemove(value: TabPaneName): void {
  emit("close-tab", String(value));
}

function handleContextMenu(event: MouseEvent, key: string, index: number): void {
  event.preventDefault();
  contextMenuKey.value = key;
  contextMenuIndex.value = index;
  contextMenuPosition.value = {
    left: event.clientX,
    top: event.clientY,
  };
  contextMenuVisible.value = true;
  document.addEventListener("click", closeContextMenu);
}

function closeContextMenu(): void {
  contextMenuVisible.value = false;
  contextMenuIndex.value = -1;
  document.removeEventListener("click", closeContextMenu);
}

function handleRefreshCurrent(): void {
  if (!contextMenuKey.value) return;
  emit("refresh-tab", contextMenuKey.value);
  closeContextMenu();
}

function handleCloseCurrent(): void {
  if (!contextMenuKey.value) return;
  emit("close-tab", contextMenuKey.value);
  closeContextMenu();
}

function handleCloseOthers(): void {
  if (!contextMenuKey.value) return;
  emit("close-other-tabs", contextMenuKey.value);
  closeContextMenu();
}

function handleCloseLeft(): void {
  if (!contextMenuKey.value) return;
  emit("close-left-tabs", contextMenuKey.value);
  closeContextMenu();
}

function handleCloseRight(): void {
  if (!contextMenuKey.value) return;
  emit("close-right-tabs", contextMenuKey.value);
  closeContextMenu();
}

function handleCloseAll(): void {
  emit("close-all-tabs");
  closeContextMenu();
}

onBeforeUnmount(() => {
  document.removeEventListener("click", closeContextMenu);
});
</script>
