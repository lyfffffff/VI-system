// 原型回归 Story 的页面级 Mock 数据（筛选、导航、标签页）。
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
