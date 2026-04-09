<!-- 组件：表格 -->
<template>
  <section class="table-section wb-table-panel wb-soft-panel">
    <div class="wb-table-panel__header">
      <h3 class="wb-table-panel__title">游戏概况</h3>
      <el-dropdown trigger="hover" @command="handleMetricTemplateCommand">
        <el-button :icon="Operation" class="metrics-dropdown-btn">
          自定义指标
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in tableMetricTemplates"
              :key="item.key"
              :command="item.key"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="wb-table-panel__scroll">
      <el-table
        :data="tableData"
        row-key="id"
        :row-class-name="tableRowClassName"
        style="width: 100%"
      >
      <el-table-column prop="name" label="游戏" :min-width="autoColWidths.name">
        <template #header>
          <span class="workbench-table-name workbench-table-name--header">
            <el-icon class="workbench-table-name__chevron"
              ><ArrowRight
            /></el-icon>
            <span>游戏</span>
          </span>
        </template>
        <template #default="{ row }">
          <span class="workbench-table-name">
            <el-icon v-if="!row.isSummary" class="workbench-table-name__chevron"
              ><ArrowRight
            /></el-icon>
            <span>{{ row.name }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="revenue"
        label="流水"
        align="right"
        :min-width="autoColWidths.revenue"
        sortable="custom"
      />
      <el-table-column prop="revenueMom" label="环" align="right" :min-width="autoColWidths.revenueMom">
        <template #default="{ row }">
          <span
            :class="
              rowTrendClass(row.revenueMom) === 'is-up'
                ? 'wb-table-trend--up'
                : 'wb-table-trend--down'
            "
            >{{ row.revenueMom }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="revenueYoy" label="同" align="right" :min-width="autoColWidths.revenueYoy">
        <template #default="{ row }">
          <span
            :class="
              rowTrendClass(row.revenueYoy) === 'is-up'
                ? 'wb-table-trend--up'
                : 'wb-table-trend--down'
            "
            >{{ row.revenueYoy }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="income"
        label="收入"
        align="right"
        :min-width="autoColWidths.income"
        sortable="custom"
      />
      <el-table-column
        prop="cost"
        label="消耗"
        align="right"
        :min-width="autoColWidths.cost"
        sortable="custom"
      />
      <el-table-column prop="costMom" label="环" align="right" :min-width="autoColWidths.costMom">
        <template #default="{ row }">
          <span
            :class="
              rowTrendClass(row.costMom) === 'is-up'
                ? 'wb-table-trend--up'
                : 'wb-table-trend--down'
            "
            >{{ row.costMom }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="costYoy" label="同" align="right" :min-width="autoColWidths.costYoy">
        <template #default="{ row }">
          <span
            :class="
              rowTrendClass(row.costYoy) === 'is-up'
                ? 'wb-table-trend--up'
                : 'wb-table-trend--down'
            "
            >{{ row.costYoy }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="grossProfit"
        label="销售毛利润"
        align="right"
        :min-width="autoColWidths.grossProfit"
        sortable="custom"
      />
      <el-table-column
        prop="firstDayRoi"
        label="首日ROI"
        align="right"
        :min-width="autoColWidths.firstDayRoi"
        sortable="custom"
      />
      <el-table-column
        prop="registerUnitPrice"
        label="注册单价"
        align="right"
        :min-width="autoColWidths.registerUnitPrice"
        sortable="custom"
      />
      <el-table-column
        prop="newAccounts"
        label="新增账号"
        align="right"
        :min-width="autoColWidths.newAccounts"
        sortable="custom"
      />
      <el-table-column
        prop="activeAccounts"
        label="活跃账号"
        align="right"
        :min-width="autoColWidths.activeAccounts"
        sortable="custom"
      />
      <el-table-column
        prop="paidAccounts"
        label="付费账号"
        align="right"
        :min-width="autoColWidths.paidAccounts"
        sortable="custom"
      />
      <el-table-column
        prop="payRate"
        label="付费率"
        align="right"
        :min-width="autoColWidths.payRate"
        sortable="custom"
      />
      <el-table-column
        prop="arppu"
        label="ARPPU"
        align="right"
        :min-width="autoColWidths.arppu"
        sortable="custom"
      />
      </el-table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowRight, Operation } from "@element-plus/icons-vue";
import { useAutoTableColWidth } from "@yyxxfe/vi";
import {
  type ICockpitGameOverviewRow,
  cockpitGameOverviewTableData as tableData,
  cockpitTableMetricTemplates as tableMetricTemplates,
} from "./mock-data";

const autoColWidths = useAutoTableColWidth(
  tableData,
  [
    {
      key: "name",
      headerText: "游戏",
      valueGetter: (row) => row.name,
      padding: 56,
      minWidth: 120,
    },
    {
      key: "revenue",
      headerText: "流水",
      valueGetter: (row) => row.revenue,
      sortPadding: 24,
    },
    {
      key: "revenueMom",
      headerText: "环",
      valueGetter: (row) => row.revenueMom,
      minWidth: 50,
    },
    {
      key: "revenueYoy",
      headerText: "同",
      valueGetter: (row) => row.revenueYoy,
      minWidth: 50,
    },
    {
      key: "income",
      headerText: "收入",
      valueGetter: (row) => row.income,
      sortPadding: 24,
    },
    {
      key: "cost",
      headerText: "消耗",
      valueGetter: (row) => row.cost,
      sortPadding: 24,
    },
    {
      key: "costMom",
      headerText: "环",
      valueGetter: (row) => row.costMom,
      minWidth: 50,
    },
    {
      key: "costYoy",
      headerText: "同",
      valueGetter: (row) => row.costYoy,
      minWidth: 50,
    },
    {
      key: "grossProfit",
      headerText: "销售毛利润",
      valueGetter: (row) => row.grossProfit,
      sortPadding: 24,
    },
    {
      key: "firstDayRoi",
      headerText: "首日ROI",
      valueGetter: (row) => row.firstDayRoi,
      sortPadding: 24,
    },
    {
      key: "registerUnitPrice",
      headerText: "注册单价",
      valueGetter: (row) => row.registerUnitPrice,
      sortPadding: 24,
    },
    {
      key: "newAccounts",
      headerText: "新增账号",
      valueGetter: (row) => row.newAccounts,
      sortPadding: 24,
    },
    {
      key: "activeAccounts",
      headerText: "活跃账号",
      valueGetter: (row) => row.activeAccounts,
      sortPadding: 24,
    },
    {
      key: "paidAccounts",
      headerText: "付费账号",
      valueGetter: (row) => row.paidAccounts,
      sortPadding: 24,
    },
    {
      key: "payRate",
      headerText: "付费率",
      valueGetter: (row) => row.payRate,
      sortPadding: 24,
    },
    {
      key: "arppu",
      headerText: "ARPPU",
      valueGetter: (row) => row.arppu,
      sortPadding: 24,
    },
  ],
  { padding: 40 },
);

function rowTrendClass(value: string): string {
  return value.startsWith("+") ? "is-up" : "is-down";
}

function tableRowClassName({ row }: { row: ICockpitGameOverviewRow }): string {
  return row.isSummary ? "product-row" : "";
}

function handleMetricTemplateCommand(_command: string): void {
  // 回归场景仅用于展示 UI 形态，命令逻辑在业务项目验证。
}
</script>
