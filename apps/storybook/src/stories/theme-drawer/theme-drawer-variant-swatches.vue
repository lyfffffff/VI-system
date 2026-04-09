<!-- 主题变体色卡 Story 画布。 -->
<script setup lang="ts">
import { THEME_PRESETS, getThemeVariants, initViTheme, useViTheme } from "@yyxxfe/vi";
import type { IThemeVariants } from "@yyxxfe/vi";

const VARIANT_KEYS: { key: keyof IThemeVariants; label: string }[] = [
  { key: "light3", label: "Light 3" },
  { key: "light5", label: "Light 5" },
  { key: "light7", label: "Light 7" },
  { key: "light8", label: "Light 8" },
  { key: "light9", label: "Light 9" },
  { key: "dark2", label: "Dark 2" },
];

initViTheme();
const { themeKey, isDark, setTheme, setDark, applyTheme } = useViTheme();
applyTheme();

const presetsWithVariants = THEME_PRESETS.map((preset) => ({
  preset,
  variants: getThemeVariants(preset.hex),
}));
</script>

<template>
  <div class="story-root vi-theme-scope theme-variant-swatches-story">
    <div class="regression-toolbar">
      <h3>主题变体色卡</h3>
      <div class="toolbar-actions">
        <el-switch
          :model-value="isDark"
          inline-prompt
          active-text="暗"
          inactive-text="亮"
          @update:model-value="setDark"
        />
      </div>
    </div>
    <p class="theme-variant-swatches-story__hint">
      每行：主色 + 由主色混合生成的亮阶 / 暗阶；与运行时注入的语义变量一致。点击整卡应用该主题。
    </p>
    <div class="theme-variant-grid">
      <button
        v-for="row in presetsWithVariants"
        :key="row.preset.key"
        type="button"
        class="theme-variant-card"
        :class="{ 'is-active': themeKey === row.preset.key }"
        @click="setTheme(row.preset.key)"
      >
        <div class="theme-variant-card__head">
          <span class="theme-variant-card__en">{{ row.preset.englishName }}</span>
          <span class="theme-variant-card__zh">{{ row.preset.name }}</span>
          <code class="theme-variant-card__key">{{ row.preset.key }}</code>
        </div>
        <div class="theme-variant-swatches" aria-label="主题色与变体">
          <div class="theme-variant-swatch">
            <span
              class="theme-variant-swatch__chip"
              :style="{ backgroundColor: row.preset.hex }"
              :title="'主色 ' + row.preset.hex"
            />
            <span class="theme-variant-swatch__label">Base</span>
          </div>
          <div
            v-for="v in VARIANT_KEYS"
            :key="row.preset.key + '-' + v.key"
            class="theme-variant-swatch"
          >
            <span
              class="theme-variant-swatch__chip"
              :style="{ backgroundColor: row.variants[v.key] }"
              :title="v.label + ' ' + row.variants[v.key]"
            />
            <span class="theme-variant-swatch__label">{{ v.label }}</span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style>
/* Story 画布：主题变体色卡（原 `.storybook/story-styles/theme-drawer.stories.css`） */
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

.theme-variant-swatches-story__hint {
  margin: 0 0 16px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.theme-variant-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 1200px;
}

.theme-variant-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  padding: 12px 14px;
  margin: 0;
  text-align: left;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--vi-radius-md);
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.theme-variant-card:hover {
  border-color: var(--el-color-primary-light-5);
}

.theme-variant-card.is-active {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(var(--el-color-primary-rgb), 0.12);
}

.theme-variant-card__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 12px;
}

.theme-variant-card__en {
  font-weight: 600;
}

.theme-variant-card__zh {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.theme-variant-card__key {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: var(--vi-radius-sm);
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.theme-variant-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  align-items: flex-end;
}

.theme-variant-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 52px;
}

.theme-variant-swatch__chip {
  display: block;
  width: 44px;
  height: 28px;
  border-radius: var(--vi-radius-sm);
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
}

html.dark .theme-variant-swatch__chip {
  border-color: rgba(255, 255, 255, 0.14);
}

.theme-variant-swatch__label {
  font-size: 10px;
  line-height: 1.2;
  color: var(--el-text-color-secondary);
  text-align: center;
  max-width: 56px;
}
</style>
