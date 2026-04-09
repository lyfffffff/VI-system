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
      date: "2026-04-01",
      name: "永恒之门 · 国内版",
      category: "MMORPG",
      status: "已上线",
      amount: "892.17",
      region: "华东",
      address: "上海市浦东新区张江",
      remark: "首日 ROI 达标",
      channel: "商店 A",
      owner: "林某",
      phone: "13800001001",
      email: "lin@demo.game",
      sku: "SKU-MMORPG-CN-01",
      warehouse: "沪东仓",
      settleDays: "T+7",
      platform: "iOS / Android",
    },
    {
      date: "2026-04-02",
      name: "伏魔 · 海外",
      category: "ARPG",
      status: "灰度",
      amount: "1,092.30",
      region: "北美",
      address: "美西 CDN 节点",
      remark: "投放爬坡中",
      channel: "FB / Google",
      owner: "赵某",
      phone: "+1-415-555-0199",
      email: "zhao.ops@demo.game",
      sku: "SKU-ARPG-NA-02",
      warehouse: "美西云仓",
      settleDays: "T+14",
      platform: "Steam / Epic",
    },
    {
      date: "2026-04-02",
      name: "星舰计划",
      category: "SLG",
      status: "冻结",
      amount: "210.05",
      region: "华南",
      address: "深圳市南山区",
      remark: "预算冻结",
      channel: "联运 B",
      owner: "钱某",
      phone: "13800001003",
      email: "qian@demo.game",
      sku: "SKU-SLG-ORG-03",
      warehouse: "粤南仓",
      settleDays: "—",
      platform: "H5 / 小程序",
    },
    {
      date: "2026-04-03",
      name: "荒原行动",
      category: "射击",
      status: "已上线",
      amount: "503.88",
      region: "华北",
      address: "北京市海淀区",
      remark: "周活跃稳定",
      channel: "硬核联盟",
      owner: "孙某",
      phone: "13800001004",
      email: "sun@demo.game",
      sku: "SKU-FPS-BUNDLE-04",
      warehouse: "京津仓",
      settleDays: "T+5",
      platform: "Android",
    },
    {
      date: "2026-04-03",
      name: "幻境传说",
      category: "卡牌",
      status: "灰度",
      amount: "356.42",
      region: "华西",
      address: "成都市高新区",
      remark: "接入支付中",
      channel: "直播联运",
      owner: "周某",
      phone: "13800001005",
      email: "zhou@demo.game",
      sku: "SKU-TCG-LIVE-05",
      warehouse: "川渝仓",
      settleDays: "T+10",
      platform: "全渠道",
    },
  ],
  treeTableData: [
    {
      id: "org-1",
      date: "2026-04-01",
      name: "发行事业群",
      category: "组织",
      status: "已上线",
      amount: "2,854.82",
      region: "全国",
      address: "总部",
      remark: "汇总节点",
      children: [
        {
          id: "org-1-1",
          date: "2026-04-02",
          name: "国内发行",
          category: "业务",
          status: "已上线",
          amount: "1,982.40",
          region: "华东",
          address: "上海",
          remark: "",
          children: [
            {
              id: "org-1-1-1",
              date: "2026-04-02",
              name: "MMO 产品线",
              category: "产品",
              status: "已上线",
              amount: "892.17",
              region: "华东",
              address: "张江",
              remark: "",
            },
            {
              id: "org-1-1-2",
              date: "2026-04-02",
              name: "休闲产品线",
              category: "产品",
              status: "灰度",
              amount: "410.23",
              region: "华南",
              address: "深圳",
              remark: "",
            },
          ],
        },
        {
          id: "org-1-2",
          date: "2026-04-03",
          name: "海外发行",
          category: "业务",
          status: "灰度",
          amount: "872.42",
          region: "海外",
          address: "新加坡",
          remark: "",
        },
      ],
    },
    {
      id: "org-2",
      date: "2026-04-01",
      name: "平台中台",
      category: "组织",
      status: "已上线",
      amount: "120.00",
      region: "华北",
      address: "北京",
      remark: "成本中心",
      children: [
        {
          id: "org-2-1",
          date: "2026-04-03",
          name: "数据中台",
          category: "部门",
          status: "已上线",
          amount: "68.50",
          region: "华北",
          address: "亦庄",
          remark: "",
        },
        {
          id: "org-2-2",
          date: "2026-04-03",
          name: "运维与安全",
          category: "部门",
          status: "已上线",
          amount: "51.50",
          region: "华北",
          address: "顺义",
          remark: "",
        },
      ],
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

    <section class="tdp-playground__section">
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

<style>
/* Story 画布：Playground 头部与内联按钮（原 `.storybook/story-styles/theme-drawer.stories.css`） */
.story-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.story-header-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.story-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.story-header p {
  margin: 0;
  color: var(--el-text-color-secondary);
}

.sb-no-flex-stretch,
.el-button.sb-no-flex-stretch {
  flex: 0 0 auto;
  width: auto;
  max-width: fit-content;
  align-self: flex-start;
}
</style>
