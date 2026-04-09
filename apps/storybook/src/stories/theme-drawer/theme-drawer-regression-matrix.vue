<!-- 主题回归矩阵：亮/暗 + 17 色切换。 -->
<script setup lang="ts">
import { ref, watch } from "vue";
import { THEME_PRESETS, initViTheme, useViTheme } from "@yyxxfe/vi";

initViTheme();
const { themeKey, isDark, setTheme, setDark, applyTheme } = useViTheme();

const activeIndex = ref(
  THEME_PRESETS.findIndex((item) => item.key === themeKey.value),
);

applyTheme();

watch(
  themeKey,
  (nextThemeKey) => {
    activeIndex.value = THEME_PRESETS.findIndex((item) => item.key === nextThemeKey);
  },
  { immediate: true },
);

function switchNextTheme(): void {
  const nextIndex = (activeIndex.value + 1) % THEME_PRESETS.length;
  activeIndex.value = nextIndex;
  setTheme(THEME_PRESETS[nextIndex].key);
}

const presets = THEME_PRESETS;
</script>

<template>
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
        <el-button type="primary" class="sb-no-flex-stretch" @click="switchNextTheme">
          下一主题
        </el-button>
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
</template>

<style>
/* Story 画布：主题回归矩阵（原 `.storybook/story-styles/theme-drawer.stories.css`） */
.regression-toolbar h3 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.regression-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-chip-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}

.theme-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--vi-radius-sm);
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  cursor: pointer;
}

.theme-chip.is-active {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(var(--el-color-primary-rgb), 0.12);
}

.theme-chip__swatch {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.sb-no-flex-stretch,
.el-button.sb-no-flex-stretch {
  flex: 0 0 auto;
  width: auto;
  max-width: fit-content;
  align-self: flex-start;
}
</style>
