## ADDED Requirements

### Requirement: 文档主入口收敛到总结文档
系统 MUST 将项目说明内容收敛到 `总结.md`，并 SHALL 避免并行维护多份同义说明文档。

#### Scenario: 完成文档收敛
- **WHEN** 团队执行文档治理增量
- **THEN** `总结.md` MUST 覆盖项目、规范、design-system、story 文档核心内容
- **AND** 冗余说明文档 MUST 被移除或降级为单行入口跳转

### Requirement: Story 文档变更同步总结文档
系统 MUST 在 Storybook 分组或关键示例发生变更时同步更新 `总结.md` 的 story 文档章节。

#### Scenario: Story 分组变更同步
- **WHEN** 团队新增、移除或调整 Story 分组
- **THEN** `总结.md` 中对应分组说明 MUST 在同一变更中更新
- **AND** 文档中的分组名称 MUST 与 Storybook 实际分组一致

### Requirement: README 提供主题组件最小接入步骤
系统 MUST 在 `README.md` 提供“使用主题组件”的简要步骤，并 SHALL 覆盖初始化、组件挂载与状态消费三个最小环节。

#### Scenario: 新接入项目按 README 实施
- **WHEN** 开发者参考 `README.md` 接入主题组件
- **THEN** 文档 MUST 包含 `initViTheme` 初始化步骤
- **AND** 文档 MUST 包含 `ThemeDrawer` 挂载方式与 `useViTheme` 基本用法
