// 数据驾驶舱原型 Story：页面级与组件级 Mock 数据汇总。
import {
  DataAnalysis,
  Odometer,
  TrendCharts,
  Wallet,
} from "@element-plus/icons-vue";
import type { Component } from "vue";

export const cockpitNavItems = [
  { key: "analysis", label: "经营分析" },
  { key: "game", label: "游戏分析" },
  { key: "competitor", label: "竞品监控" },
];

export const cockpitDefaultHistoryTabs = [
  { key: "cockpit", label: "数据驾驶舱", closable: true },
];

export const cockpitGameTreeData = [
  {
    value: "all",
    label: "全部游戏",
    children: [
      { value: "fumo-cn", label: "伏魔主版本" },
      { value: "xianyu-cn", label: "仙遇主版本" },
      { value: "origin-cn", label: "源星战域" },
    ],
  },
  {
    value: "fumo",
    label: "伏魔",
    children: [
      { value: "fumo-cn", label: "伏魔-国内服" },
      { value: "fumo-sea", label: "伏魔-海外服" },
    ],
  },
  {
    value: "xianyu",
    label: "仙遇",
    children: [{ value: "xianyu-cn", label: "仙遇-国内服" }],
  },
  {
    value: "origin",
    label: "源星战域",
    children: [{ value: "origin-cn", label: "源星战域-国内服" }],
  },
];

export const cockpitDistributionOptions = [
  { label: "全部发行", value: "all" },
  { label: "自研发行", value: "self" },
  { label: "联运发行", value: "joint" },
];

export const cockpitAppTypeOptions = [
  { label: "全部应用", value: "all" },
  { label: "iOS", value: "ios" },
  { label: "Android", value: "android" },
];

export const cockpitBrandTitle = "天问 · 数据平台";

export const cockpitDemoUser = {
  name: "Demo账号",
  role: "管理员",
} as const;

export interface ICockpitSidebarItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface ICockpitSidebarSection {
  key: string;
  title: string;
  icon: Component;
  items: ICockpitSidebarItem[];
}

export const cockpitSidebarSectionsByNav: Record<
  string,
  ICockpitSidebarSection[]
> = {
  analysis: [
    {
      key: "cockpit",
      title: "数据驾驶舱",
      icon: Odometer,
      items: [],
    },
    {
      key: "model",
      title: "数据模型",
      icon: TrendCharts,
      items: [{ key: "business-estimation", label: "经营预测" }],
    },
    {
      key: "finance",
      title: "财务分析",
      icon: Wallet,
      items: [
        { key: "revenue-data", label: "收入数据" },
        { key: "revenue-analysis", label: "收入分析" },
        { key: "share-config", label: "分成配置" },
        { key: "platform-daily", label: "财务日报" },
      ],
    },
    {
      key: "basic-data",
      title: "基础数据",
      icon: DataAnalysis,
      items: [
        { key: "basic-data-overview", label: "基础概览", disabled: true },
        { key: "basic-data-new-accounts", label: "新增账号", disabled: true },
        { key: "basic-data-revenue", label: "流水收入", disabled: true },
        { key: "basic-data-yearly-revenue", label: "年度收入", disabled: true },
      ],
    },
  ],
  game: [
    {
      key: "general",
      title: "通用分析",
      icon: DataAnalysis,
      items: [
        { key: "game-realtime", label: "实时数据" },
        { key: "game-periodic", label: "周月年表" },
        { key: "game-retention", label: "留存分析" },
        { key: "game-payment", label: "付费分析" },
        { key: "game-channel", label: "渠道分析" },
        { key: "game-ads", label: "广告分析" },
      ],
    },
  ],
  competitor: [
    {
      key: "ranking",
      title: "竞品监控",
      icon: DataAnalysis,
      items: [{ key: "competitor-ranking", label: "排行榜" }],
    },
  ],
};

export interface ICockpitMetricCard {
  title: string;
  value: string;
  mom: string;
  yoy: string;
}

const cockpitMetricFirstPage: ICockpitMetricCard[] = [
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

export const cockpitMetricPages: ICockpitMetricCard[][] = [
  cockpitMetricFirstPage,
  cockpitMetricFirstPage,
];

export type CockpitTrendMetricKey = "revenue" | "income" | "cost" | "profit";

export const cockpitTrendChartMetricOptions: {
  label: string;
  value: CockpitTrendMetricKey;
}[] = [
  { label: "流水", value: "revenue" },
  { label: "收入", value: "income" },
  { label: "消耗", value: "cost" },
  { label: "毛利润", value: "profit" },
];

export const cockpitTrendGameTreeData = [
  {
    value: "all",
    label: "全部游戏",
    children: [
      { value: "fumo-main", label: "伏魔主版本" },
      { value: "xianyu-main", label: "仙遇主版本" },
      { value: "origin-main", label: "源星战域" },
    ],
  },
];

export const cockpitTrendDates = [
  "3/27",
  "3/28",
  "3/29",
  "3/30",
  "3/31",
  "4/1",
  "4/2",
];

export const cockpitTrendBaseData: Record<string, number[]> = {
  "fumo-main": [758, 784, 803, 789, 812, 835, 860],
  "xianyu-main": [412, 426, 439, 448, 462, 455, 470],
  "origin-main": [233, 240, 245, 252, 248, 260, 268],
};

export const cockpitTrendMetricMeta: Record<
  CockpitTrendMetricKey,
  { label: string; factor: number; unit: string }
> = {
  revenue: { label: "流水", factor: 1, unit: "万" },
  income: { label: "收入", factor: 0.7, unit: "万" },
  cost: { label: "消耗", factor: 0.58, unit: "万" },
  profit: { label: "毛利润", factor: 0.16, unit: "万" },
};

export const cockpitTrendDefaultMetrics: CockpitTrendMetricKey[] = ["revenue"];

export const cockpitTrendDefaultCompareGames = [
  "fumo-main",
  "xianyu-main",
  "origin-main",
];

export interface ICockpitGameOverviewRow extends Record<string, unknown> {
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

export const cockpitTableMetricTemplates = [
  { key: "system-default", label: "系统模板-核心指标" },
  { key: "system-growth", label: "系统模板-增长指标" },
  { key: "custom", label: "新建自定义指标" },
];

export const cockpitGameOverviewTableData: ICockpitGameOverviewRow[] = [
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
