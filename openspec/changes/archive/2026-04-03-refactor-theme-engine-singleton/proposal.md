## Why

当前主题系统在结构上已可用，但存在“语义变量双源赋值”与“配置入口分散”问题：`semantic-vars.less` 与运行时 `useViTheme` 同时定义关键 `--vi-*` 变量，且 `useViTheme(options)` 与 `initViTheme(options)` 都可变更配置，导致链路认知与排障成本上升。随着主题能力成为项目主线，需要先完成一次结构收敛，确保主题状态、变量解析、变量注入、持久化的职责边界稳定，再继续扩展组件主题能力。

### 背景
- 现状：主题链路已形成 `tokens -> semantic -> mapping -> overrides`，ThemeDrawer 组件职责清晰。
- 问题：动态主题值缺少“单一事实来源”，且配置入口存在双通道。
- 机会：在不破坏现有对外 API 的前提下，完成单例引擎化重构，降低后续演进风险。

### 目标
- 明确全局单例主题引擎模型，统一主题状态生命周期。
- 将主题链路拆分为可维护模块：`resolver`、`applier`、`persistence`、`engine`。
- 固化“`initViTheme` 为唯一配置入口”的约束，`useViTheme` 仅承担状态消费与操作。
- 默认开启 `syncDefaultViPrefix`，确保自定义前缀改造期兼容。

### 范围
- 包含：`packages/vi/src/theme/*`、`packages/vi/src/composables/use-vi-theme.ts` 的结构重构与接口收敛。
- 包含：Storybook 场景调用方式对齐（移除 `useViTheme(options)` 作为配置入口的用法）。
- 包含：文档与 OpenSpec 同步更新。

### 非目标
- 不新增主题预设数量，不改主题算法视觉结果。
- 不引入多实例主题引擎（本次明确继续全局单例）。
- 不扩展 ThemeDrawer 交互功能（仅保持现有契约）。

### 验收标准
- 主题初始化配置仅由 `initViTheme(options)` 生效。
- `useViTheme` 在多个调用点共享同一单例状态，主题切换行为保持一致。
- `syncDefaultViPrefix` 默认开启，自定义前缀场景下 `--vi-*` 与自定义前缀变量可同步输出。
- Storybook `Theme Drawer` 与 `Prototype Regression` 场景通过回归验证，无行为回退。

## What Changes

- 引入内部主题引擎分层：`theme-resolver`（纯计算）、`theme-applier`（DOM 注入）、`theme-persistence`（存储读写）、`theme-engine`（单例编排）。
- 重构 `useViTheme`：由“状态+配置混合入口”调整为“单例状态消费入口”。
- 重构 `initViTheme`：作为唯一配置入口初始化单例引擎并执行首次应用。
- 增加 `syncDefaultViPrefix` 配置项，默认 `true`。
- 对齐 Storybook 与文档示例，避免通过 `useViTheme(options)` 传配置。
- **BREAKING**：后续版本将移除 `useViTheme(options)` 的配置语义（本次保留兼容层并给出迁移路径）。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `theme-system`：新增“全局单例主题引擎、唯一配置入口、动态变量单一来源与前缀兼容策略”相关规范要求。

## Impact

- **受影响代码**
  - `packages/vi/src/composables/use-vi-theme.ts`
  - `packages/vi/src/theme/init-theme.ts`
  - `packages/vi/src/theme/*`（新增引擎分层模块）
  - `apps/storybook/src/stories/theme-drawer.stories.ts`
  - `apps/storybook/src/stories/prototype-regression.stories.ts`
  - `docs/guides/theme-drawer*.md`
- **受影响系统**
  - VI 主题链路（状态、注入、持久化、前缀兼容）
  - Storybook 主题回归场景
- **依赖影响**
  - 不新增外部依赖，沿用 Vue 3 + TypeScript + Less + Element Plus
