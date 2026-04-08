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
