# 规范更新计划

## 概述

本变更集主要涉及技术实现层面的优化，不直接引入新的功能需求。但在实施过程中，建议对以下规范进行补充说明，以确保开发和使用的一致性。

## 受影响的规范

### 1. component-docs 规范 (`openspec/specs/component-docs/spec.md`)

#### 建议新增需求

**Requirement: Storybook 支持源码与构建模式切换**

系统 MUST 支持 Storybook 在读取 vi 库源码和读取打包产物之间切换，并 SHALL 提供明确的模式指示。

##### Scenario: 源码模式验证
- **WHEN** 开发者使用源码模式启动 Storybook
- **THEN** 系统 MUST 读取 `packages/vi/src/` 下的源码
- **AND** 系统 MUST 在启动日志中明确显示"源码模式"
- **AND** 开发者 MUST 能享受热更新和源码调试

##### Scenario: 构建模式验证
- **WHEN** 开发者使用构建模式启动 Storybook
- **THEN** 系统 MUST 先执行 vi 库构建
- **AND** 系统 MUST 读取 `packages/vi/dist/` 下的打包产物
- **AND** 系统 MUST 在启动日志中明确显示"构建模式"
- **AND** 组件行为 MUST 与源码模式保持一致

**Rationale**:
- 源码模式便于开发和调试
- 构建模式用于验证打包产物的正确性
- 双模式切换确保开发与生产环境的一致性

---

### 2. theme-system 规范 (`openspec/specs/theme-system/spec.md`)

#### 建议新增需求

**Requirement: 主题库多格式导出支持**

系统 MUST 提供同时支持 ESM 和 CJS 格式的主题库导出，并 SHALL 包含完整的 TypeScript 类型定义。

##### Scenario: ESM 项目导入
- **WHEN** ESM 项目导入 `@yyxxfe/vi`
- **THEN** 系统 MUST 提供标准的 ESM 入口 (`./dist/index.js`)
- **AND** 类型定义 MUST 可用 (`./dist/index.d.ts`)

##### Scenario: CJS 项目导入
- **WHEN** CJS 项目通过 require 导入 `@yyxxfe/vi`
- **THEN** 系统 MUST 提供标准的 CJS 入口 (`./dist/index.cjs`)
- **AND** 类型定义 MUST 可用

##### Scenario: 按需导入
- **WHEN** 使用方仅导入特定功能（如主题 API 或 ThemeDrawer 组件）
- **THEN** 系统 MUST 提供独立的导出入口
- **AND** Tree Shaking MUST 生效以减小包体积

**Requirement: 主题库样式正确导出**

系统 MUST 将主题样式正确导出为独立的 CSS 文件，并 SHALL 支持使用方按需引入。

##### Scenario: 样式文件导出
- **WHEN** 使用方导入 `@yyxxfe/vi/styles`
- **THEN** 系统 MUST 返回编译后的 CSS 文件 (`./dist/style.css`)
- **AND** CSS MUST 包含所有必要的 CSS 变量定义

##### Scenario: 样式按需引入
- **WHEN** 使用方仅使用部分主题功能
- **THEN** 使用方 MAY 选择性地引入样式文件
- **AND** 样式文件 MUST 包含所有必要的样式（不支持部分样式抽取）

**Rationale**:
- 支持 ESM 和 CJS 确保与不同项目生态兼容
- 完整的类型定义提供良好的开发体验
- 按需导入和 Tree Shaking 减小包体积
- 样式导出符合前端工程化最佳实践

---

## 实施说明

### 更新时机

这些规范更新建议在以下时机实施：

1. **变更集归档前**：在完成技术实现后，同步更新相关规范
2. **变更集归档时**：在实施报告中记录规范的更新内容
3. **归档后**：根据实际使用反馈，持续优化规范描述

### 更新方式

1. **component-docs 规范**：
   - 在现有需求之后添加新的需求章节
   - 保持与现有规范一致的格式
   - 包含完整的场景描述

2. **theme-system 规范**：
   - 在现有需求之后添加新的需求章节
   - 明确说明导出格式和类型要求
   - 添加样式导出的相关场景

### 向后兼容性

所有新增需求均为**非破坏性**变更：
- 现有功能需求保持不变
- 新增需求为技术实现提供指导
- 不影响现有使用方

## 不更新的理由

以下规范在本变更集中不需要更新：

- **现有功能需求**：主题预设、变量注入、组件改造等需求保持不变
- **业务场景需求**：主题切换、模式切换等业务逻辑需求不受影响
- **设计系统规范**：不涉及设计 tokens 或设计规范变更

---

## 备注

本变更集主要是技术实现层面的优化，核心目标包括：

1. **提升开发体验**：Storybook 支持双模式切换
2. **增强兼容性**：支持 ESM 和 CJS 双格式
3. **完善类型支持**：提供完整的 TypeScript 类型定义
4. **优化包体积**：通过 Tree Shaking 减小不必要的代码

这些改进不会改变 VI 系统的核心功能和用户体验，而是让工具链更加完善，使用方式更加标准。
