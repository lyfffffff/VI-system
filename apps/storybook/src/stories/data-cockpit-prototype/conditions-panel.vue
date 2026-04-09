<!-- 驾驶舱原型：页头筛选条（时间维度、快捷日、发行/游戏/应用类型等） -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Refresh } from "@element-plus/icons-vue";
import {
  cockpitAppTypeOptions,
  cockpitDistributionOptions,
  cockpitGameTreeData,
} from "./mock-data";

const isRefreshing = defineModel<boolean>("isRefreshing", { default: false });

const period = ref("day");
const shortcut = ref<"today" | "yesterday">("today");

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const now = new Date();
const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const reportDate = ref(todayString);
const distributionMethod = ref("all");
const selectedGame = ref("all");
const appType = ref("all");
const lastUpdateTime = ref(new Date());
let clockTimer: number | undefined;

const gameTreeData = cockpitGameTreeData;
const distributionOptions = cockpitDistributionOptions;
const appTypeOptions = cockpitAppTypeOptions;

const dataFreshnessLabel = computed(() =>
  shortcut.value === "today" ? "实时" : "离线数据",
);
const freshnessTip = computed(() =>
  dataFreshnessLabel.value === "离线数据" ? "离线 T+1 更新" : "",
);
const formattedUpdateTime = computed(() => {
  const d = lastUpdateTime.value;
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
});

function setShortcut(value: "today" | "yesterday"): void {
  shortcut.value = value;
  const date = new Date();
  if (value === "yesterday") {
    date.setDate(date.getDate() - 1);
  }
  reportDate.value = formatDate(date);
}

async function refreshData(): Promise<void> {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 650);
  });
  lastUpdateTime.value = new Date();
  isRefreshing.value = false;
}

onMounted(() => {
  clockTimer = window.setInterval(() => {
    if (shortcut.value === "today") {
      lastUpdateTime.value = new Date();
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (clockTimer) {
    window.clearInterval(clockTimer);
  }
});

defineExpose({ refreshData });
</script>

<template>
  <section class="workbench-filter">
    <div class="workbench-filter__row">
      <div class="workbench-filter__left">
        <h2 class="workbench-filter__title">数据驾驶舱</h2>
        <div class="workbench-filter__meta">
          <span>更新于 {{ formattedUpdateTime }}</span>
          <el-tooltip
            :content="freshnessTip"
            :disabled="dataFreshnessLabel === '实时'"
            placement="bottom"
          >
            <span
              class="workbench-filter__freshness cockpit-freshness-tag"
              :class="
                dataFreshnessLabel === '实时' ? 'is-realtime' : 'is-offline'
              "
            >
              {{ dataFreshnessLabel }}
            </span>
          </el-tooltip>
          <el-button
            v-if="shortcut === 'today'"
            link
            size="small"
            :icon="Refresh"
            :loading="isRefreshing"
            class="workbench-filter__refresh-btn"
            @click="refreshData"
          >
            {{ isRefreshing ? "" : "刷新" }}
          </el-button>
        </div>
      </div>

      <div class="workbench-filter__right">
        <el-radio-group v-model="period" class="dimension-radio-group">
          <el-radio-button label="day">日</el-radio-button>
          <el-radio-button label="week">周</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
          <el-radio-button label="year">年</el-radio-button>
        </el-radio-group>

        <div class="time-shortcut-group">
          <el-button
            class="shortcut-btn"
            :type="shortcut === 'today' ? 'primary' : 'default'"
            @click="setShortcut('today')"
          >
            今日
          </el-button>
          <el-button
            class="shortcut-btn"
            :type="shortcut === 'yesterday' ? 'primary' : 'default'"
            @click="setShortcut('yesterday')"
          >
            昨日
          </el-button>
          <el-date-picker
            v-model="reportDate"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="date-picker-joined"
          />
        </div>

        <el-select
          v-model="distributionMethod"
          style="width: 130px"
          placeholder="发行方式"
        >
          <el-option
            v-for="opt in distributionOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-tree-select
          v-model="selectedGame"
          :data="gameTreeData"
          check-strictly
          :render-after-expand="false"
          style="width: 180px"
          placeholder="选择游戏"
        />
        <el-select
          v-model="appType"
          style="width: 120px"
          placeholder="应用类型"
        >
          <el-option
            v-for="opt in appTypeOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
    </div>
  </section>
</template>

<style>
.time-shortcut-group {
  display: inline-flex;
  align-items: center;
}
</style>
