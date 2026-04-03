## Why

当前 `packages/vi` 的主题能力已经可用，但在“语义变量分层完整性、Element Plus 基础组件风格一致性、业务局部覆盖边界、前缀可配置链路”上仍有优化空间。随着 V2 开发即将启动，现在需要先把这批优化沉淀为可执行规范，避免实现阶段再次分散。

### 背景
- 现状：主题切换、17 预设主题、暗黑模式和主题抽屉已具备基础能力。
- 问题：基础组件样式与业务原型（data-cockpit）仍有差距，覆盖策略尚未形成统一 contract。
- 机会：通过 OpenSpec 固化“var 优先、覆盖兜底、可扩展目录”策略，降低后续改造风险。

### 目标
- 收敛 V2 主题系统架构：token -> semantic -> mapping -> overrides。
- 明确 Element Plus 基础组件改造路径与优先级。
- 明确业务局部覆盖与全局主题并存时的优先级规则。
- 保持前缀可配置能力（默认 `--vi-*`，但不绑定最终前缀）。

### 范围
- 包含：主题引擎优化、语义变量扩展、Element Plus 映射扩展、组件覆盖分层、文档与 Storybook 验收场景。
- 包含：围绕按钮、输入、选择器、表格、抽屉、标签页/单选等首批组件的样式契约。
- 不包含：水印能力、服务端主题同步、自定义调色器。

### 非目标
- 不改造业务页面结构与业务组件逻辑。
- 不新增新的主题预设数量（V2 仍维持 17 个）。
- 不引入与主题无关的 UI 重构。

### 验收标准
- 主题切换与暗黑切换在 Storybook 与业务接入中行为一致。
- 首批组件具备“变量优先 + 覆盖兜底”改造结果，且可回归验证。
- 前缀可配置链路完整，不出现硬编码导致的失效。
- 局部覆盖不污染全局主题，且优先级可预期。

## What Changes

- 基于现有主题系统新增 V2 优化变更：统一主题扩展 contract 与组件改造策略。
- 扩展语义变量层与 Element Plus 映射层，减少直接覆盖组件内部样式的比例。
- 将覆盖样式按组件职责拆分（button/input/select/textarea/table/dialog/drawer/tabs/radio），降低 blast radius。
- 明确业务局部覆盖规范（允许局部主题覆盖，全局为默认兜底）。
- 增补 Storybook 验收矩阵与接入文档，确保改造可验证。
- **BREAKING**：主题样式改造需遵循“CSS var -> 业务 class -> 直接样式覆盖”的优先级；不再接受无约束全局覆盖。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `theme-system`：增强主题系统在变量分层、组件覆盖策略、局部覆盖优先级与前缀可配置方面的规范要求。

## Impact

- **受影响代码**
  - `packages/vi/src/composables/use-vi-theme.ts`
  - `packages/vi/src/theme/theme-config.ts`
  - `packages/vi/src/types/theme.ts`
  - `packages/vi/src/styles/tokens.less`
  - `packages/vi/src/styles/semantic-vars.less`
  - `packages/vi/src/styles/element-plus-mapping.less`
  - `packages/vi/src/styles/workbench-mapping.less`
  - `packages/vi/src/styles/workbench-overrides.less`
  - `packages/vi/src/components/theme-drawer/theme-drawer.vue`
  - `docs/guides/theme-drawer*.md`
  - `apps/storybook/src/stories/theme-drawer.stories.ts`

- **受影响系统**
  - VI 主题引擎（状态、变量注入、暗黑机制）
  - VI 样式体系（语义层、映射层、覆盖层）
  - Storybook 文档与验收流程

- **依赖影响**
  - 延续 `Vue 3 + Element Plus + Less` 体系，不新增框架依赖。

## Governance Artifacts

- 该文档定义“分层优先级、修改边界、评审门槛、回滚策略”，作为 V2 及后续迭代的统一准入规范。


## Prototype Normalization

- 该清单以 `askdata-dashboard.pages.dev/data-cockpit` 与 `junelce-workbench-design-system/references` 为参照，定义分阶段落地与 DoD。
