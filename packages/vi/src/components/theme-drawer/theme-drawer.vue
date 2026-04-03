<template>
  <el-drawer
    :model-value="drawerVisible"
    :with-header="false"
    :direction="drawerDirection"
    :size="320"
    class="vi-theme-drawer"
    @update:model-value="handleOpenChange"
  >
    <div class="theme-drawer">
      <div class="theme-drawer__header">
        <span class="theme-drawer__title">主题设置</span>
        <button type="button" class="theme-drawer__close" @click="handleClose">
          ✕
        </button>
      </div>

      <section class="theme-drawer__section">
        <div class="theme-drawer__section-title">
          <el-icon><Moon /></el-icon>
          <span>模式设置</span>
        </div>

        <div class="mode-switch">
          <button
            type="button"
            class="mode-switch__item"
            :class="{ 'is-active': !isDark }"
            @click="handleModeSwitch(false)"
          >
            <span class="mode-switch__name">浅色模式</span>
            <span class="mode-switch__desc">明亮清爽</span>
          </button>

          <button
            type="button"
            class="mode-switch__item"
            :class="{ 'is-active': isDark }"
            @click="handleModeSwitch(true)"
          >
            <span class="mode-switch__name">暗黑模式</span>
            <span class="mode-switch__desc">护眼舒适</span>
          </button>
        </div>
      </section>

      <section class="theme-drawer__section">
        <div class="theme-drawer__section-title">
          <el-icon><BrushFilled /></el-icon>
          <span>主题颜色</span>
        </div>

        <div class="theme-grid">
          <button
            v-for="theme in themes"
            :key="theme.key"
            type="button"
            class="theme-grid__item"
            @click="handleThemeChange(theme.key)"
          >
            <span
              class="theme-grid__swatch"
              :class="{ 'is-active': themeKey === theme.key }"
              :style="{ backgroundColor: theme.hex }"
            >
              <el-icon v-if="themeKey === theme.key"><Select /></el-icon>
            </span>
            <span class="theme-grid__en">{{ theme.englishName }}</span>
            <span class="theme-grid__zh">{{ theme.name }}</span>
          </button>
        </div>
      </section>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
// 主题抽屉组件：提供主题色与明暗模式切换的统一交互面板。
import { computed } from "vue";
import { BrushFilled, Moon, Select } from "@element-plus/icons-vue";
import { THEME_PRESETS } from "../../theme/theme-config";
import { useViTheme } from "../../composables/use-vi-theme";
import type { IThemePreset, ThemeColorKey } from "../../types/theme";

interface Props {
  /**
   * @description 抽屉是否打开。
   * @default false
   */
  open?: boolean;
  /**
   * @description 抽屉展开方向。
   * @default 'right'
   */
  placement?: "right" | "left";
  /**
   * @description 自定义主题列表；未传入时使用内置 `THEME_PRESETS`。
   * @default THEME_PRESETS
   */
  themes?: IThemePreset<ThemeColorKey>[];
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  placement: "right",
  themes: () => THEME_PRESETS,
});

const emit = defineEmits<{
  /** 更新打开状态 */
  "update:open": [open: boolean];
  /** 主题变化事件 */
  "theme-change": [themeKey: ThemeColorKey];
  /** 模式变化事件 */
  "mode-change": [isDark: boolean];
}>();

const { themeKey, isDark, setTheme, setDark } = useViTheme();

const drawerVisible = computed(() => props.open);
const drawerDirection = computed(() =>
  props.placement === "left" ? "ltr" : "rtl",
);
const themes = computed(() => props.themes);

// 透传抽屉开关状态到外层 v-model。
function handleOpenChange(open: boolean): void {
  emit("update:open", open);
}

// 关闭抽屉。
function handleClose(): void {
  emit("update:open", false);
}

// 切换主题色并抛出主题变更事件。
function handleThemeChange(nextThemeKey: ThemeColorKey): void {
  if (themeKey.value === nextThemeKey) return;
  setTheme(nextThemeKey);
  emit("theme-change", nextThemeKey);
}

// 切换明暗模式并抛出模式变更事件。
function handleModeSwitch(nextDark: boolean): void {
  if (isDark.value === nextDark) return;
  setDark(nextDark);
  emit("mode-change", nextDark);
}
</script>

<style scoped lang="less">
.theme-drawer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  padding: 4px;
}

.theme-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.theme-drawer__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.theme-drawer__close {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: var(--vi-radius-sm);
  background: transparent;
  color: var(--el-text-color-secondary);
  cursor: pointer;

  &:hover {
    background: var(--wb-close-hover-bg, rgba(15, 23, 42, 0.08));
  }
}

.theme-drawer__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.theme-drawer__section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 600;

  .el-icon {
    color: var(--el-color-primary);
    font-size: 16px;
  }
}

.mode-switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.mode-switch__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--vi-radius-md);
  background: var(--el-bg-color);
  text-align: left;
  cursor: pointer;

  &.is-active {
    border-color: var(--el-color-primary);
    background: rgba(var(--el-color-primary-rgb), 0.08);
  }
}

.mode-switch__name {
  color: var(--el-text-color-primary);
  font-size: 13px;
  font-weight: 600;
}

.mode-switch__desc {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px 4px;
}

.theme-grid__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.theme-grid__swatch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--vi-radius-md);
  border: 2px solid transparent;
  color: #fff;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: scale(1.05);
  }

  &.is-active {
    border-color: var(--el-color-primary);
    box-shadow:
      0 0 0 2px var(--el-bg-color),
      0 0 0 4px var(--el-color-primary);
  }
}

.theme-grid__en,
.theme-grid__zh {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.theme-grid__en {
  font-weight: 500;
}
</style>
