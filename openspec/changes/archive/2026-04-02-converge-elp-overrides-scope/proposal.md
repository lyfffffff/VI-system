## Why

当前 `packages/vi/src/styles/overrides/*.less` 在“全局覆盖”和“业务作用域覆盖”边界上不够清晰，存在覆盖范围偏大与重复覆盖问题。随着 ELP 组件收敛继续推进，需要将覆盖策略统一为“仅保留 Element Plus 默认样式与原型差异”，并明确选择器层级，降低后续回归风险。

### 背景
- 现状：部分覆盖写在多作用域选择器中，难以判断是否应全局生效。
- 问题：存在与变量映射层重复或不必要的覆盖，维护成本上升。
- 机会：以原型参考样式与组件规范为基线，建立可复用的覆盖判定规则。

### 目标
- 明确 ELP 覆盖规则：全局覆盖直接使用 `.el-*`；业务差异覆盖统一收敛到 `.vi-theme-scope`。
- 清理 `overrides` 目录中的冗余规则，仅保留“ELP 默认与原型差异”。
- 保持现有主题变量链路（token -> semantic -> mapping）不被破坏。

### 范围
- 包含：`packages/vi/src/styles/overrides` 下全部 less 文件。
- 包含：`workbench-overrides.less` 聚合入口与注释同步。
- 包含：OpenSpec 任务与规范同步。

### 非目标
- 不新增主题变量或主题预设。
- 不改动业务页面结构。
- 不引入覆盖目录外的新组件改造。

### 验收标准
- 覆盖文件可明确区分“全局覆盖”和“`.vi-theme-scope` 作用域覆盖”。
- 覆盖内容仅保留原型与 ELP 差异，不包含无差异冗余规则。
- `pnpm build:vi` 构建通过。

## What Changes

- 新增一轮 ELP 覆盖收敛变更，建立覆盖判定规则与落地任务。
- 按组件梳理 `overrides/*.less`，剔除不必要覆盖，保留最小差异集。
- 统一作用域策略：
  - 全局覆盖：直接写 `.el-*`；
  - 作用域覆盖：仅写在 `.vi-theme-scope` 下。
- 同步更新 OpenSpec 任务状态与变更文档。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `theme-system`：补充 ELP 覆盖最小化与作用域分层规则（全局 `.el-*` / 作用域 `.vi-theme-scope`）。
- `component-docs`：Storybook 预览样式分层（宿主基础层与 Story 演示层拆分）。

## Impact

- **受影响代码**
  - `packages/vi/src/styles/overrides/*.less`
  - `packages/vi/src/styles/workbench-overrides.less`
  - `apps/storybook/.storybook/preview.css`
  - `apps/storybook/.storybook/preview.stories.css`
- **受影响系统**
  - VI 样式覆盖层（overrides）
  - Storybook 预览样式结构
- **依赖影响**
  - 无新增依赖
