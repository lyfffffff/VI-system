# 原型还原规范化清单（Data Cockpit）

## 参照输入
- 线上原型：`askdata-dashboard.pages.dev/data-cockpit`
- 规范文档：`junelce-workbench-design-system/references/*`

## 目标
将 VI 视觉库的常用组件能力收敛为“可复用、可回归、可约束”的规范化实现，支持原型级页面还原。

## 实施顺序
1. Foundation Token
2. Layout Token
3. 筛选条组件族
4. 指标卡组件族
5. 表格组件族
6. 图表容器
7. 导航体系
8. 弹层体系
9. 暗黑模式
10. Storybook 回归矩阵

## 规范化条目（可勾选）

### A. Foundation Token（必做）
- [ ] A1. 颜色：主色、文本、边框、填充、状态色（红涨绿跌）全部语义化。
- [ ] A2. 圆角：`6/8/10/12/14` 分级落地（弹层内控件使用 6）。
- [ ] A3. 阴影：面板、卡片、浮层分级统一。
- [ ] A4. 字体：正文 14、表格 12，数字类统一 `tabular-nums`。

验收：切换 17 主题 + 深浅色，基础控件不回退到 Element Plus 默认视觉。

### B. Layout Token（必做）
- [ ] B1. 顶栏高度、侧栏宽度、内容区内边距与模块间距变量化。
- [ ] B2. 页面背景 `--wb-page-bg` 与壳层背景职责分离。

验收：Workbench 布局壳层在 Storybook/业务接入视觉一致。

### C. 筛选条组件族（高优先）
- [ ] C1. 时间维度分段（`el-radio-button`）对齐原型：高度/边框/激活态。
- [ ] C2. 今日/昨日快捷按钮组对齐原型：拼接边框、激活态主色。
- [ ] C3. 日期/下拉/输入控件高度与圆角统一。

验收：形成 `time-filter-bar` 场景，可独立复用。

### D. 指标卡组件族（高优先）
- [ ] D1. 指标卡容器（圆角、边框、阴影、背景）标准化。
- [ ] D2. 标题/数值/环比同比文案层级统一。
- [ ] D3. 趋势色语义固定：红涨绿跌。

验收：卡片在浅色与暗色都保持信息层级清晰。

### E. 表格组件族（高优先）
- [ ] E1. 表头背景、行高、字体、边框策略统一。
- [ ] E2. 固定列背景与 hover 行背景修复。
- [ ] E3. 状态 Tag 胶囊样式可复用。

验收：表格无杂线、固定列无透底、暗黑模式无违和。

### F. 图表容器（中优先）
- [ ] F1. 图表卡片容器与标题区视觉统一。
- [ ] F2. 图例、网格线、坐标轴文本色按语义变量驱动。

验收：切换主题色时图表强调色跟随，非强调元素保持中性。

### G. 导航体系（中优先）
- [ ] G1. 顶栏导航激活态（底部指示条）标准化。
- [ ] G2. 侧栏一级/二级菜单激活、hover、禁用态标准化。
- [ ] G3. TagsView 激活与未激活态标准化。

验收：导航状态明确，交互反馈一致。

### H. 弹层体系（中优先）
- [ ] H1. Dialog/Drawer 内输入、选择、文本域圆角降级到 6px。
- [ ] H2. footer 按钮间距与主次按钮视觉统一。
- [ ] H3. 抽屉宽度档位（360/480/640）规范化。

验收：弹层内部视觉密度与主页面区分明显。

### I. 暗黑模式（必做）
- [ ] I1. 每个亮色语义变量都有暗色对应值。
- [ ] I2. 暗色下 primary/hover/focus 不回退默认 EP 色值。

验收：深色模式下按钮、筛选条、表格与弹层均可用且层次清晰。

### J. Storybook 回归矩阵（必做）
- [ ] J1. 新增 `Prototype Regression` 场景（筛选条/指标卡/表格/图表容器）。
- [ ] J2. 每个场景支持亮/暗 + 多主题色切换。
- [ ] J3. 文档化“变量层/组件层/业务层”归属。

验收：每次样式改动必须有对应 story 可复现与回归。

## 交付定义（DoD）
- 所有新增覆盖均在作用域内（`.vi-theme-scope` / `.workbench-layout` 等）。
- 禁止新增无作用域全局 `.el-*` 样式。
- 变更必须标注层级归属：`变量层 / 组件层 / 业务层`。
- 通过 `pnpm build:storybook`。

## 对应实现目录
- `packages/vi/src/styles/tokens.less`
- `packages/vi/src/styles/semantic-vars.less`
- `packages/vi/src/styles/element-plus-mapping.less`
- `packages/vi/src/styles/workbench-mapping.less`
- `packages/vi/src/styles/overrides/*.less`
- `apps/storybook/src/stories/*.stories.ts`
- `docs/guides/*`
