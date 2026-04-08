## 1. 主题配置与类型收敛

- [x] 1.1 将 `theme-config` 调整为单一数据源，确保 17 预设主题仅维护一处。
- [x] 1.2 让 `ThemeColorKey` 从主题配置推导，消除类型与配置双维护。
- [x] 1.3 补充主题元数据约束（名称、顺序、色值格式）并添加校验。

## 2. 主题引擎收敛

- [x] 2.1 梳理 `useViTheme` 的状态流，保持“读取存储 -> 注入变量 -> 持久化”单向闭环。
- [x] 2.3 明确暗黑模式基准为 `html.dark`，并验证亮/暗切换无闪烁。

## 3. Token 与语义变量扩展

- [x] 3.1 在 `tokens.less` 中收敛基础 token（颜色、圆角、阴影、间距），移除语义化混写。
- [x] 3.2 在 `semantic-vars.less` 中补齐 surface/text/border/fill/interactive 语义变量。
- [x] 3.3 为暗黑模式补齐对应语义变量值，确保与亮色模式成对定义。

## 4. Element Plus / Workbench 映射补全

- [x] 4.1 扩展 `element-plus-mapping.less`，覆盖首批组件所需关键 `--el-*` 变量。
- [x] 4.2 调整 `workbench-mapping.less`，统一改为从语义层读取，不直接硬编码品牌值。
- [x] 4.3 建立映射清单，标记“变量可表达”和“需覆盖兜底”的边界。

## 5. 覆盖样式分层改造

- [x] 5.1 将 `workbench-overrides.less` 按组件职责拆分为独立覆盖文件（button/input/select/textarea/table/dialog/drawer/tabs/radio）。
- [x] 5.2 统一覆盖作用域，避免无约束全局 `.el-*` 污染。
- [x] 5.3 对无法变量化的差异保留最小覆盖，并在文件内记录用途。

## 6. ThemeDrawer 契约对齐

- [x] 6.1 对齐 `ThemeDrawer` 的 Props/Emits 契约与规范文档描述。
- [x] 6.2 保持抽屉仅承担“主题与模式切换”控制面板职责，不引入主题实现细节耦合。
- [x] 6.3 验证抽屉在亮/暗与 17 色下的交互一致性。

## 7. 局部覆盖能力落地（3B）

- [x] 7.1 定义局部覆盖推荐作用域与示例写法（语义变量层覆盖）。
- [x] 7.2 验证局部覆盖优先于全局主题，且作用域外不受影响。
- [x] 7.3 禁止将局部覆盖常态化为直接覆写 `--el-*` 的方案。

## 8. Storybook 验收矩阵

- [x] 8.1 新增主题回归场景：亮/暗 + 17 色轮询。
- [x] 8.2 新增组件回归场景：按钮、输入、选择器、文本域、表格、弹窗、抽屉、标签页/单选。

## 9. 文档与规范同步

- [x] 9.1 更新 `docs/guides/theme-drawer.md`，补充 V2 契约与覆盖优先级说明。
- [x] 9.2 更新 `docs/guides/theme-drawer-integration.md`，补充局部覆盖与回滚建议。
- [x] 9.3 在 OpenSpec 变更中同步维护 proposal/design/specs/tasks 一致性。


- [x] 10.2 将治理规范同步到当前 OpenSpec change（proposal/design/tasks）。
- [x] 10.3 约定后续组件改造必须通过 Storybook 回归场景验收。


## 11. 高保真原型规范化清单落地

- [x] 11.2 Foundation Token：完成颜色/圆角/阴影/字号与等宽数字的全量对齐。
- [x] 11.3 Layout Token：完成顶栏/侧栏/内容区/背景的变量化约束。
- [x] 11.4 筛选条组件族：完成时间分段、快捷按钮、日期控件的一比一还原。
- [x] 11.5 指标卡组件族：完成卡片容器与趋势语义的统一规范。
- [x] 11.6 表格组件族：完成表头、行高、固定列、状态标签的一比一对齐。
- [x] 11.7 图表容器：完成图例/网格线/轴文本与主题联动规范。
- [x] 11.8 导航体系：完成 topbar/sidebar/tags 的状态样式统一。
- [x] 11.9 弹层体系：完成 dialog/drawer 的圆角与 footer 行为规范。
- [x] 11.10 暗黑模式：完成全链路暗色变量配对与交互态校验。
- [x] 11.11 Storybook：补齐 Prototype Regression 场景并纳入回归门槛。
