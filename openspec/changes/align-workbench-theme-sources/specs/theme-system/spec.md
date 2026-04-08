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
