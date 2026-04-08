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

interface ITableRow {
  id: string;
  name: string;
  revenue: string;
  revenueMom: string;
  revenueYoy: string;
  income: string;
  cost: string;
  costMom: string;
  costYoy: string;
  grossProfit: string;
  firstDayRoi: string;
  registerUnitPrice: string;
  newAccounts: string;
  activeAccounts: string;
  paidAccounts: string;
  payRate: string;
  arppu: string;
  isSummary?: boolean;
}

const tableMetricTemplates = [
  { key: "system-default", label: "系统模板-核心指标" },
  { key: "system-growth", label: "系统模板-增长指标" },
  { key: "custom", label: "新建自定义指标" },
];

const tableData: ITableRow[] = [
  {
    id: "summary",
    name: "合计(共 6 个产品)",
    revenue: "600",
    revenueMom: "-0.6%",
    revenueYoy: "+4%",
    income: "413",
    cost: "322",
    costMom: "+0.6%",
    costYoy: "+4.4%",
    grossProfit: "132",
    firstDayRoi: "143%",
    registerUnitPrice: "¥36.2",
    newAccounts: "11,777",
    activeAccounts: "29,443",
    paidAccounts: "1,767",
    payRate: "6.25%",
    arppu: "¥234",
    isSummary: true,
  },
  {
    id: "fumo",
    name: "伏魔",
    revenue: "311",
    revenueMom: "-2.1%",
    revenueYoy: "+5.2%",
    income: "217",
    cost: "115",
    costMom: "+4.8%",
    costYoy: "+6.2%",
    grossProfit: "110",
    firstDayRoi: "152%",
    registerUnitPrice: "¥36.2",
    newAccounts: "4,136",
    activeAccounts: "10,340",
    paidAccounts: "620",
    payRate: "6.25%",
    arppu: "¥315",
  },
  {
    id: "xianyu",
    name: "仙遇",
    revenue: "159",
    revenueMom: "+3.5%",
    revenueYoy: "-1.8%",
    income: "110",
    cost: "90",
    costMom: "-2.3%",
    costYoy: "+8.1%",
    grossProfit: "45",
    firstDayRoi: "141%",
    registerUnitPrice: "¥36.2",
    newAccounts: "3,430",
    activeAccounts: "8,575",
    paidAccounts: "515",
    payRate: "6.25%",
    arppu: "¥213",
  },
  {
    id: "qingyunjue2",
    name: "青云诀2",
    revenue: "86",
    revenueMom: "-5.2%",
    revenueYoy: "+12.5%",
    income: "56",
    cost: "42",
    costMom: "+1.2%",
    costYoy: "-3.5%",
    grossProfit: "16",
    firstDayRoi: "135%",
    registerUnitPrice: "¥36.2",
    newAccounts: "2,285",
    activeAccounts: "5,713",
    paidAccounts: "343",
    payRate: "6.25%",
    arppu: "¥163",
  },
  {
    id: "originwar",
    name: "源星战域",
    revenue: "19",
    revenueMom: "+8.3%",
    revenueYoy: "-4.2%",
    income: "13",
    cost: "38",
    costMom: "-6.1%",
    costYoy: "+2.8%",
    grossProfit: "-23",
    firstDayRoi: "154%",
    registerUnitPrice: "¥36.2",
    newAccounts: "856",
    activeAccounts: "2,140",
    paidAccounts: "128",
    payRate: "6.25%",
    arppu: "¥102",
  },
  {
    id: "swordrecord",
    name: "御剑封神录",
    revenue: "15",
    revenueMom: "-1.5%",
    revenueYoy: "+7.8%",
    income: "10",
    cost: "22",
    costMom: "+3.2%",
    costYoy: "-5.3%",
    grossProfit: "-10",
    firstDayRoi: "130%",
    registerUnitPrice: "¥36.2",
    newAccounts: "620",
    activeAccounts: "1,550",
    paidAccounts: "93",
    payRate: "6.25%",
    arppu: "¥95",
  },
  {
    id: "qingyunchuan",
    name: "青云传",
    revenue: "10",
    revenueMom: "+4.2%",
    revenueYoy: "-2.5%",
    income: "7",
    cost: "15",
    costMom: "-1.8%",
    costYoy: "+9.2%",
    grossProfit: "-6",
    firstDayRoi: "110%",
    registerUnitPrice: "¥36.2",
    newAccounts: "450",
    activeAccounts: "1,125",
    paidAccounts: "68",
    payRate: "6.25%",
    arppu: "¥88",
  },
];

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

function tableRowClassName({ row }: { row: ITableRow }): string {
  return row.isSummary ? "product-row" : "";
}

function handleMetricTemplateCommand(_command: string): void {
  // 回归场景仅用于展示 UI 形态，命令逻辑在业务项目验证。
}
</script>
