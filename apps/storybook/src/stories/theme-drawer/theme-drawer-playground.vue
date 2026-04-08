<!-- ThemeDrawer Playground：与 Storybook Controls / Actions 对接。 -->
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  ThemeDrawer,
  THEME_PRESETS,
  initViTheme,
  useViTheme,
} from "@yyxxfe/vi";
import type { IThemePreset, ThemeColorKey } from "@yyxxfe/vi";

const props = withDefaults(
  defineProps<{
    open?: boolean;
    placement?: "left" | "right";
    themes?: IThemePreset<ThemeColorKey>[];
  }>(),
  {
    open: false,
    placement: "right",
  },
);

const emit = defineEmits<{
  storyUpdateOpen: [open: boolean];
  storyThemeChange: [themeKey: ThemeColorKey];
  storyModeChange: [isDark: boolean];
}>();

const innerOpen = ref(Boolean(props.open));
const dialogOpen = ref(false);

const selectValue = ref("");
const selectMultipleValue = ref<string[]>([]);
const inputValue = ref("");
const dateValue = ref("");
const checkboxValue = ref(false);
const radioValue = ref("");
const switchValue = ref(false);

const options = [
  { value: "1", label: "选项1" },
  { value: "2", label: "选项2" },
  { value: "3", label: "选项3" },
];

initViTheme();
const { themeKey, isDark, currentTheme, applyTheme } = useViTheme();
applyTheme();

const themes = computed<IThemePreset<ThemeColorKey>[] | undefined>(() => {
  if (Array.isArray(props.themes) && props.themes.length > 0) {
    return props.themes;
  }
  return THEME_PRESETS;
});

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

function openDialogHandle() {}
</script>

<template>
  <div class="story-root vi-theme-scope">
    <div class="story-header">
      <h3>VI 主题抽屉预览</h3>
      <div class="story-header-info">
        <p>
          当前主题：{{ currentTheme?.name }}（{{ themeKey }}） /
          {{ isDark ? "暗黑模式" : "浅色模式" }}
        </p>
        <el-button
          type="primary"
          class="sb-no-flex-stretch"
          @click="innerOpen = true"
        >
          打开主题抽屉
        </el-button>
      </div>

      <el-button type="primary" class="sb-no-flex-stretch"> 查询 </el-button>
      <el-button type="primary" size="small" class="sb-no-flex-stretch">
        查询
      </el-button>
      <el-select v-model="selectValue" placeholder="请选择" style="width: 130px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="selectMultipleValue" placeholder="请选择" multiple style="width: 160px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="inputValue" placeholder="请输入" style="width: 130px;"/>
      <el-date-picker
        v-model="dateValue"
        type="date"
        placeholder="请选择日期"
        style="width: 260px;"/>
      <el-checkbox v-model="checkboxValue" label="请选择" />
      <el-radio v-model="radioValue" label="请选择" />
      <el-switch v-model="switchValue" />

      <!-- 点击打开弹窗，弹窗中展示基础组件 -->
      <el-button type="primary" @click="dialogOpen = true" class="sb-no-flex-stretch">打开弹窗</el-button>

      <el-dialog v-model="dialogOpen" title="弹窗样式回归" width="520px">
        <el-button type="primary" class="sb-no-flex-stretch"> 查询 </el-button>
        <el-button type="primary" size="small" class="sb-no-flex-stretch">
          查询
        </el-button>
        <el-select v-model="selectValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="selectMultipleValue" placeholder="请选择" multiple>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="inputValue" placeholder="请输入" />
        <el-date-picker
          v-model="dateValue"
          type="date"
          placeholder="请选择日期"
        />
        <el-checkbox v-model="checkboxValue" label="请选择" />
        <el-radio v-model="radioValue" label="请选择" />
        <el-switch v-model="switchValue" />
        <template #footer>
          <div class="dialog-footer-actions">
            <el-button @click="dialogOpen = false">取消</el-button>
            <el-button type="primary" @click="dialogOpen = false"
              >确认</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>

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
