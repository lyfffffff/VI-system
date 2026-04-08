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
