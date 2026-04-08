<!-- ThemeDrawer Playground：与 Storybook Controls / Actions 对接。 -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import {
  ThemeDrawer,
  THEME_PRESETS,
  initViTheme,
  useViTheme,
} from "@yyxxfe/vi";
import type { IThemePreset, ThemeColorKey } from "@yyxxfe/vi";
import ThemeDrawerPlaygroundSamples from "./theme-drawer-playground-samples.vue";

interface Props {
  open?: boolean;
  placement?: "left" | "right";
  themes?: IThemePreset<ThemeColorKey>[];
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  placement: "right",
});

const emit = defineEmits<{
  storyUpdateOpen: [open: boolean];
  storyThemeChange: [themeKey: ThemeColorKey];
  storyModeChange: [isDark: boolean];
}>();

const innerOpen = ref(Boolean(props.open));
const dialogOpen = ref(false);

const sampleForm = reactive({
  selectValue: "",
  selectMultipleValue: [] as string[],
  inputValue: "",
  textareaValue: "",
  inputNumberValue: 10,
  dateValue: "",
  dateRangeValue: [] as string[],
  timeValue: "",
  timeRangeValue: [] as string[],
  cascaderValue: [] as string[],
  checkboxValue1: false,
  checkboxValue2: false,
  checkboxGroupValue: ["Option 1"] as string[],
  radioValue: "a",
  radioButtonValue: "a",
  switchValue1: false,
  switchValue2: false,
  sliderValue: 36,
  rateValue: 3,
  colorValue: "#14b8a6",
  treeSelectValue: [] as string[],
  paginationCurrentPage: 1,
  paginationPageSize: 10,
  tableData: [
    {
      date: "2016-05-03",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
    {
      date: "2016-05-02",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
    {
      date: "2016-05-04",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
    {
      date: "2016-05-01",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
  ],
});

initViTheme();
const { themeKey, isDark, currentTheme, applyTheme } = useViTheme();
applyTheme();

const themes = computed<IThemePreset<ThemeColorKey>[] | undefined>(() => {
  if (Array.isArray(props.themes) && props.themes.length > 0) {
    return props.themes;
  }
  return THEME_PRESETS;
});

const modeLabel = computed(() => (isDark.value ? "暗黑模式" : "浅色模式"));

watch(
  () => props.open,
  (value) => {
    innerOpen.value = Boolean(value);
  },
);

function handleUpdateOpen(nextOpen: boolean): void {
  innerOpen.value = nextOpen;
  emit("storyUpdateOpen", nextOpen);
}

function handleThemeChange(nextThemeKey: ThemeColorKey): void {
  emit("storyThemeChange", nextThemeKey);
}

function handleModeChange(nextDark: boolean): void {
  emit("storyModeChange", nextDark);
}
</script>

<template>
  <div class="story-root vi-theme-scope tdp-playground">
    <header class="tdp-playground__header story-header">
      <h3>VI 主题抽屉预览</h3>
      <div class="story-header-info">
        <p>
          当前主题：{{ currentTheme?.name }}（{{ themeKey }}） /
          {{ modeLabel }}
        </p>
        <el-button
          type="primary"
          class="sb-no-flex-stretch"
          @click="innerOpen = true"
        >
          打开主题抽屉
        </el-button>
      </div>

    </header>

    <section class="tdp-playground__section wb-soft-panel">
      <div class="tdp-playground__section-header">
        <h4>页面内展示（非弹窗）</h4>
        <el-button
          type="primary"
          class="sb-no-flex-stretch"
          @click="dialogOpen = true"
        >
          打开弹窗对比
        </el-button>
      </div>
      <ThemeDrawerPlaygroundSamples layout="dialog" :form="sampleForm" />
    </section>

    <el-dialog
      v-model="dialogOpen"
      title="弹窗样式回归"
      width="789px"
      destroy-on-close
    >
      <ThemeDrawerPlaygroundSamples layout="dialog" :form="sampleForm" />
      <template #footer>
        <div class="tdp-playground__dialog-footer dialog-footer-actions">
          <el-button @click="dialogOpen = false">取消</el-button>
          <el-button type="primary" @click="dialogOpen = false">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <ThemeDrawer
      v-model:open="innerOpen"
      :placement="placement"
      :themes="themes"
      @update:open="handleUpdateOpen"
      @theme-change="handleThemeChange"
      @mode-change="handleModeChange"
    />
  </div>
</template>

<style scoped lang="less">
.tdp-playground__dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.tdp-playground__section {
  margin-top: 12px;
  padding: 12px;
}

.tdp-playground__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
</style>
