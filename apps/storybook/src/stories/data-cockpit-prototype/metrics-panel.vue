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
        v-for="(_page, index) in cockpitMetricPages"
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
import { cockpitMetricPages } from "./mock-data";

withDefaults(
  defineProps<{
    isRefreshing?: boolean;
  }>(),
  {
    isRefreshing: false,
  },
);

const metricPageIndex = ref(0);

const currentMetrics = computed(
  () => cockpitMetricPages[metricPageIndex.value] ?? cockpitMetricPages[0],
);
const hasMetricPages = computed(() => cockpitMetricPages.length > 1);

function trendClass(value: string): string {
  return value.startsWith("+") ? "is-up" : "is-down";
}

function trendText(value: string): string {
  return value.replace(/^[+-]/, "");
}
</script>
