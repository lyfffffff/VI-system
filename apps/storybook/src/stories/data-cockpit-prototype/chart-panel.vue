<!-- 组件：趋势图表 -->
<template>
  <section class="workbench-chart-panel wb-chart-shell">
    <div class="workbench-chart-panel__header wb-chart-shell__header">
      <h3 class="workbench-chart-panel__title wb-chart-shell__title">游戏趋势</h3>
      <div class="workbench-filter__actions wb-query-panel__actions">
        <el-select v-model="chartMetrics" multiple collapse-tags style="width: 180px;" placeholder="选择指标">
          <el-option v-for="opt in chartMetricOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
        <el-tree-select
          v-model="compareGames"
          :data="trendGameTreeData"
          :render-after-expand="false"
          multiple
          show-checkbox
          check-on-click-node
          collapse-tags
          style="width: 260px;"
          placeholder="选择游戏"
        />
      </div>
    </div>

    <div v-if="compareGames.length === 0" class="wb-chart-shell__body-empty">
      <el-empty description="请先选择游戏" />
    </div>

    <div v-else class="wb-chart-shell__body">
      <div ref="trendChartRef" class="workbench-chart-echarts" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { useViTheme } from "@yyxxfe/vi";
import {
  type CockpitTrendMetricKey,
  cockpitTrendChartMetricOptions as chartMetricOptions,
  cockpitTrendBaseData as trendBaseData,
  cockpitTrendDates as trendDates,
  cockpitTrendDefaultCompareGames,
  cockpitTrendDefaultMetrics,
  cockpitTrendGameTreeData as trendGameTreeData,
  cockpitTrendMetricMeta as metricMeta,
} from "./mock-data";

const chartMetrics = ref<CockpitTrendMetricKey[]>([
  ...cockpitTrendDefaultMetrics,
]);
const compareGames = ref<string[]>([...cockpitTrendDefaultCompareGames]);
const trendChartRef = ref<HTMLDivElement>();
let trendChartInstance: echarts.ECharts | null = null;

const { themeKey, isDark } = useViTheme();

function readCssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function resolveTrendGameLabel(gameKey: string): string {
  const item = trendGameTreeData[0]?.children?.find((child) => child.value === gameKey);
  return item?.label ?? gameKey;
}

function ensureTrendChartInstance(): echarts.ECharts | null {
  if (!trendChartRef.value) return null;
  if (!trendChartInstance) {
    trendChartInstance = echarts.init(trendChartRef.value);
  }
  return trendChartInstance;
}

function buildTrendChartOption(): EChartsOption {
  const selectedGames = compareGames.value;
  const selectedMetrics =
    chartMetrics.value.length > 0 ? chartMetrics.value : cockpitTrendDefaultMetrics;

  const primary = readCssVar("--el-color-primary", "#3b82f6");
  const palette = [primary, "#6366f1", "#f97316", "#22c55e", "#a855f7"];
  const axisLabelColor = readCssVar("--wb-chart-axis-label", "#95a0b2");
  const splitLineColor = readCssVar("--wb-chart-split-line", "#eef2f7");
  const tooltipBorderColor = readCssVar("--vi-border-light", "#dfe5ef");
  const tooltipBg = isDark.value ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)";
  const tooltipText = readCssVar("--vi-text-primary", "#23345f");

  const seriesData: Array<echarts.LineSeriesOption & { unit?: string }> = [];
  const legendData: string[] = [];

  selectedGames.forEach((gameKey, gameIndex) => {
    const gameLabel = resolveTrendGameLabel(gameKey);
    const gameColor = palette[gameIndex % palette.length];
    const baseData = trendBaseData[gameKey] ?? trendBaseData["fumo-main"];

    selectedMetrics.forEach((metricKey, metricIndex) => {
      const meta = metricMeta[metricKey];
      const seriesName = selectedMetrics.length > 1 ? `${gameLabel}-${meta.label}` : gameLabel;
      const data = baseData.map((value) => Number((value * meta.factor).toFixed(2)));

      legendData.push(seriesName);
      seriesData.push({
        name: seriesName,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 4,
        data,
        unit: meta.unit,
        lineStyle: {
          width: 2,
          type: metricIndex === 0 ? "solid" : "dashed",
        },
        itemStyle: { color: gameColor },
        areaStyle: metricIndex === 0
          ? {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: `${gameColor}33` },
                  { offset: 1, color: `${gameColor}05` },
                ],
              },
            }
          : undefined,
      });
    });
  });

  return {
    animation: true,
    grid: {
      left: "4%",
      right: "3%",
      top: 24,
      bottom: 56,
      containLabel: true,
    },
    legend: {
      data: legendData,
      type: "scroll",
      bottom: 10,
      textStyle: {
        fontSize: 11,
        color: axisLabelColor,
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: tooltipBg,
      borderColor: tooltipBorderColor,
      borderWidth: 1,
      textStyle: {
        fontSize: 12,
        color: tooltipText,
      },
      formatter: (params: unknown) => {
        if (!Array.isArray(params) || params.length === 0) return "";
        const lines = params as Array<{ axisValue: string; marker: string; seriesName: string; value: number; seriesIndex: number }>;
        let html = `${lines[0]?.axisValue ?? ""}<br/>`;
        lines.forEach((item) => {
          const unit = seriesData[item.seriesIndex]?.unit ?? "";
          html += `${item.marker}${item.seriesName}: ${item.value}${unit}<br/>`;
        });
        return html;
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: trendDates,
      axisLabel: {
        fontSize: 11,
        color: axisLabelColor,
      },
      axisLine: {
        lineStyle: { color: splitLineColor },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 11,
        color: axisLabelColor,
      },
      splitLine: {
        lineStyle: { color: splitLineColor },
      },
    },
    series: seriesData,
  };
}

function renderTrendChart(): void {
  const chart = ensureTrendChartInstance();
  if (!chart) return;
  chart.setOption(buildTrendChartOption(), true);
}

function disposeTrendChart(): void {
  if (!trendChartInstance) return;
  trendChartInstance.dispose();
  trendChartInstance = null;
}

onMounted(() => {
  void nextTick(() => {
    if (compareGames.value.length > 0) {
      renderTrendChart();
    }
  });
  window.addEventListener("resize", renderTrendChart);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", renderTrendChart);
  disposeTrendChart();
});

watch(
  [compareGames, chartMetrics, themeKey, isDark],
  async () => {
    if (compareGames.value.length === 0) {
      disposeTrendChart();
      return;
    }
    await nextTick();
    renderTrendChart();
  },
  { deep: true },
);
</script>
