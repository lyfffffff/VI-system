<!-- 组件：指标卡 -->
<template>
  <div class="workbench-metrics-shell">
    <section class="workbench-metrics wb-stat-grid">
      <article v-for="(metric, index) in currentMetrics" :key="metric.title" class="workbench-metric-card wb-stat-card" data-numeric="true">
        <div class="workbench-metric-card__title wb-stat-card__title">{{ metric.title }}</div>
        <div class="workbench-metric-card__value wb-stat-card__value" :class="{ 'value-updating': isRefreshing && index === 0 }">{{ metric.value }}</div>
        <div class="workbench-metric-card__footer wb-stat-card__footer">
          <span class="workbench-metric-card__trend wb-stat-card__trend">
            <span class="workbench-metric-card__trend-label">环比</span>
            <span :class="['workbench-metric-card__trend-value', trendClass(metric.mom)]">
              <el-icon :size="12">
                <ArrowUp v-if="metric.mom.startsWith('+')" />
                <ArrowDown v-else />
              </el-icon>
              {{ trendText(metric.mom) }}
            </span>
          </span>
          <span class="workbench-metric-card__trend wb-stat-card__trend">
            <span class="workbench-metric-card__trend-label">同比</span>
            <span :class="['workbench-metric-card__trend-value', trendClass(metric.yoy)]">
              <el-icon :size="12">
                <ArrowUp v-if="metric.yoy.startsWith('+')" />
                <ArrowDown v-else />
              </el-icon>
              {{ trendText(metric.yoy) }}
            </span>
          </span>
        </div>
      </article>
    </section>

    <div v-if="hasMetricPages" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px;">
      <span
        v-for="(_page, index) in metricPages"
        :key="index"
        class="page-dot"
        :class="{ active: metricPageIndex === index }"
        @click="metricPageIndex = index"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";

interface IMetricCard {
  title: string;
  value: string;
  mom: string;
  yoy: string;
}

withDefaults(
  defineProps<{
    isRefreshing?: boolean;
  }>(),
  {
    isRefreshing: false,
  },
);

const metricPageIndex = ref(0);

const firstMetricPage: IMetricCard[] = [
  { title: "流水(元)", value: "758万", mom: "-19.9%", yoy: "-5.2%" },
  { title: "收入(元)", value: "531万", mom: "-18.5%", yoy: "-3.8%" },
  { title: "消耗(元)", value: "447万", mom: "-0.2%", yoy: "+2.1%" },
  { title: "销售毛利润(元)", value: "72万", mom: "+15.3%", yoy: "+8.5%" },
  { title: "首日ROI", value: "5.24%", mom: "-2.1%", yoy: "+1.2%" },
  { title: "注册单价(元)", value: "362.09", mom: "-3.5%", yoy: "-5.2%" },
  { title: "新增账号", value: "1.23万", mom: "+8.3%", yoy: "+12.5%" },
  { title: "DAU", value: "4.57万", mom: "+5.2%", yoy: "+3.8%" },
  { title: "付费账号", value: "2,856", mom: "+12.8%", yoy: "+8.5%" },
  { title: "付费率", value: "6.25%", mom: "+7.2%", yoy: "+4.5%" },
  { title: "ARPU(元)", value: "165.94", mom: "-2.5%", yoy: "-1.2%" },
  { title: "ARPPU(元)", value: "2,654.06", mom: "-8.6%", yoy: "-5.3%" },
];

const metricPages: IMetricCard[][] = [firstMetricPage, firstMetricPage];

const currentMetrics = computed(() => metricPages[metricPageIndex.value] ?? metricPages[0]);
const hasMetricPages = computed(() => metricPages.length > 1);

function trendClass(value: string): string {
  return value.startsWith("+") ? "is-up" : "is-down";
}

function trendText(value: string): string {
  return value.replace(/^[+-]/, "");
}
</script>
