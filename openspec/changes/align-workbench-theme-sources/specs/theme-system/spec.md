## ADDED Requirements

### Requirement: 样式调优输入来源白名单
系统 MUST 在样式细节调优过程中仅使用两类输入来源：`junelce-workbench-design-system` 与原型源码 `workbench-theme`。

#### Scenario: 调优输入来源校验
- **WHEN** 开发者提交样式调优变更
- **THEN** 变更说明 MUST 标注每项关键样式差异的来源
- **AND** 来源 MUST 属于 `junelce-workbench-design-system` 或 `workbench-theme`
- **AND** 不得引入第三方或未约定来源作为样式对齐基线

### Requirement: 分层样式统一执行顺序
系统 MUST 按 `tokens -> semantic -> mapping -> overrides` 的顺序执行样式统一，并 SHALL 将覆盖层限制为最小差异兜底。

#### Scenario: 变量层优先收敛
- **WHEN** 发现样式差异可通过变量表达
- **THEN** 实现 MUST 优先在 `tokens`、`semantic` 或 `mapping` 层修正
- **AND** 不得直接以 `overrides` 作为首选修复手段

#### Scenario: 覆盖层最小差异保留
- **WHEN** 某视觉差异无法仅通过变量链路表达
- **THEN** 实现 MAY 在 `overrides` 层补充规则
- **AND** 规则 MUST 仅保留必要差异，且可追溯到白名单输入来源

### Requirement: 原型回归场景样式一致性验收
系统 MUST 以 Storybook 原型回归场景验证样式统一结果，并 SHALL 在亮/暗模式下覆盖核心模块交互态检查。

#### Scenario: 核心模块回归通过
- **WHEN** 完成一轮样式细节调优
- **THEN** `Theme/Prototype Regression` 场景中的核心模块 MUST 通过一致性验收
- **AND** 验收记录 MUST 包含亮/暗模式及关键交互态（hover/focus/active/disabled）检查结果

### Requirement: Storybook 开发态源码联调
系统 MUST 在 Storybook 开发态优先消费工作区源码（`packages/vi/src`），并 SHALL 保证 Vite 文件系统访问范围覆盖 Storybook 应用根与仓库根目录。

#### Scenario: 开发态样式修改即时生效
- **WHEN** 开发者在 `packages/vi/src/styles/**` 修改样式并启动 Storybook
- **THEN** 预览 MUST 直接反映源码改动
- **AND** 不得要求先执行 `packages/vi` 构建才能在 Storybook 看到最新样式

#### Scenario: 工作区源码访问可用
- **WHEN** Storybook 通过 alias 读取 `@yyxxfe/vi` / `@yyxxfe/vi/styles`
- **THEN** Vite MUST 允许访问 Storybook 工程目录与仓库根目录
- **AND** 不得出现由 `server.fs.allow` 过窄导致的 403 读盘错误

### Requirement: Story 样式归属与隔离
系统 MUST 将 Story 专用页面样式就近归属到对应 Story 组件文件，且 SHALL 避免将业务故事样式集中放在 `.storybook/story-styles` 全局目录中。

#### Scenario: ThemeDrawer Story 样式归属
- **WHEN** 维护 `theme-drawer` 相关 Story
- **THEN** 页面级样式 MUST 放在对应 `theme-drawer-*.vue` 文件中
- **AND** 同类样式不得依赖全局 `story-styles` 文件才能生效

#### Scenario: DataCockpit Story 样式归属
- **WHEN** 维护 `data-cockpit-prototype` Story
- **THEN** 页面壳层样式 MUST 放在 `data-cockpit-prototype.vue` 内或其就近模块
- **AND** 样式变更 SHOULD 与模块模板一并评审

### Requirement: 暗色模式主题色阶算法一致性
系统 MUST 在暗色模式下采用独立色阶生成策略（暗底混色），并 SHALL 通过同一主题解析流程注入变量映射层。

#### Scenario: 暗色模式切换主题色
- **WHEN** 用户处于暗色模式并切换主题色
- **THEN** `light3/light5/light7/light8/light9` MUST 基于暗底混色生成
- **AND** `theme-resolver` MUST 将暗色模式状态传递给色阶计算函数

#### Scenario: 亮暗模式色阶隔离
- **WHEN** 同一主题在亮色与暗色模式下渲染
- **THEN** 两种模式下的色阶结果 MUST 可区分
- **AND** 不得复用单一“亮色混白”色阶结果

### Requirement: 表格 Hover 变量优先级收敛
系统 MUST 在 `el-table` 组件层显式收敛 hover 变量优先级，保证普通列与固定列在横向滚动场景下背景一致且不透底。

#### Scenario: 组件层变量覆盖生效
- **WHEN** Element Plus 在 `.el-table` 上声明默认 `--el-table-row-hover-bg-color`
- **THEN** VI 覆盖层 MUST 在 `.el-table` 层回写目标 hover 变量
- **AND** 仅在 `:root` 映射层设置变量视为不充分

#### Scenario: 固定列横向滚动一致性
- **WHEN** 表格存在固定列并触发 hover 态
- **THEN** 固定列与非固定列背景 MUST 保持一致
- **AND** 不得出现底层单元格文字/背景透出的视觉异常

### Requirement: 原型页面模块化拆分与数据契约
系统 MUST 将 `data-cockpit-prototype` 拆分为独立模块组件，并 SHALL 使用统一的 `mock-data.ts` 提供页面级与模块级数据契约。

#### Scenario: 模块边界清晰
- **WHEN** 维护驾驶舱原型页面
- **THEN** `header/menu/history/conditions/metrics/chart/table` MUST 作为独立组件维护
- **AND** 页面文件 SHOULD 仅负责编排与状态流转

#### Scenario: 数据契约集中管理
- **WHEN** 新增或调整原型模块数据
- **THEN** 变更 MUST 优先落在 `mock-data.ts`
- **AND** 组件间不得复制分叉同义数据结构
