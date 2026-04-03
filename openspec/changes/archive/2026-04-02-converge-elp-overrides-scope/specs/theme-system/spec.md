## ADDED Requirements

### Requirement: ELP 覆盖作用域分层
系统 MUST 在 `overrides` 层区分“全局覆盖”与“作用域覆盖”，并 SHALL 采用固定选择器策略：全局覆盖直接使用 `.el-*`，作用域覆盖仅允许在 `.vi-theme-scope` 下声明。

#### Scenario: 全局覆盖规则落位
- **WHEN** 某规则用于修正 Element Plus 默认样式与原型规范的通用差异（与业务容器无关）
- **THEN** 该规则 MUST 直接使用全局 `.el-*` 选择器
- **AND** 该规则 MUST NOT 放入 `.vi-theme-scope` 作用域容器

#### Scenario: 作用域覆盖规则落位
- **WHEN** 某规则依赖业务结构或业务 class（如拼接输入、快捷分段按钮）
- **THEN** 该规则 MUST 仅在 `.vi-theme-scope` 下声明
- **AND** 该规则 MUST NOT 直接作为全局 `.el-*` 覆盖

### Requirement: ELP 覆盖最小差异集
系统 MUST 将 `packages/vi/src/styles/overrides/*.less` 收敛为“仅保留 ELP 默认样式与原型差异”的最小覆盖集。

#### Scenario: 冗余覆盖清理
- **WHEN** 某覆盖规则与映射层变量能力重复，或不构成 ELP 与原型差异
- **THEN** 该规则 MUST 从 `overrides` 中移除

#### Scenario: 差异覆盖保留
- **WHEN** 某视觉差异无法仅通过变量映射表达
- **THEN** 该规则 MUST 保留在 `overrides` 中
- **AND** 规则 SHOULD 优先复用现有变量而非硬编码品牌值
