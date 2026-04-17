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
  props.placement === "left" ? "ltr" : "rtl"
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
