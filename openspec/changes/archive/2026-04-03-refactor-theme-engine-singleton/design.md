## Context

当前主题系统已经具备完整能力链路（`tokens -> semantic -> mapping -> overrides`）与主题组件（ThemeDrawer），但实现上存在两个结构性问题：
1. 动态语义变量由 CSS 与运行时同时赋值，缺少单一事实来源；
2. `initViTheme(options)` 与 `useViTheme(options)` 均可承担配置职责，入口语义不稳定。

该问题跨越 `packages/vi/src/theme/*`、`packages/vi/src/composables/use-vi-theme.ts`、Storybook 场景接入与文档约束，属于跨模块架构收敛改造。

约束条件：
- 技术栈保持 `Vue 3 + TypeScript + Vite + Less + Element Plus`；
- 继续维持 17 主题、浅/暗模式与 ThemeDrawer 现有交互契约；
- 本次明确采用全局单例主题引擎，不引入多实例模式。

## Goals / Non-Goals

**Goals:**
- 收敛为全局单例主题引擎，统一状态生命周期与调用语义。
- 建立清晰分层：`resolver`（计算）/ `applier`（注入）/ `persistence`（存储）/ `engine`（编排）。
- 固化 `initViTheme` 为唯一配置入口，`useViTheme` 仅用于读取与操作单例状态。
- 默认开启 `syncDefaultViPrefix`，保障自定义前缀迁移期兼容。

**Non-Goals:**
- 不调整主题视觉基线与预设主题集合。
- 不扩展 ThemeDrawer 业务功能。
- 不引入多实例容器级主题隔离能力。

## 架构方案

主题链路重构为四层内部模块 + 一个对外适配层：

1. `theme-resolver`（纯函数）
- 输入：`themeKey`、`isDark`、`prefix`。
- 输出：本次状态对应的语义变量字典（`Record<--*, string>`）。
- 不访问 DOM、不读写存储。

2. `theme-applier`（注入器）
- 负责将 resolver 输出批量写入根节点。
- 负责 `data-theme`、`data-vi-prefix` 与 `html.dark` 同步。
- 负责 `syncDefaultViPrefix=true` 时双写默认 `--vi-*`。

3. `theme-persistence`（持久化）
- 负责读取/写入 `themeStorageKey` 与 `darkStorageKey`。
- 统一异常回退与容错。

4. `theme-engine`（全局单例编排器）
- 维护唯一状态：`themeKey`、`isDark`、`prefix`。
- 对外提供：`init`、`hydrate`、`apply`、`setTheme`、`setDark`、`toggleDark`。
- 生命周期为模块级懒初始化，整个应用内只存在一个实例。

5. `useViTheme`（Vue 适配层）
- 与单例 engine 绑定，输出响应式状态与操作方法。
- 不再承担配置职责（兼容期可接受参数但仅用于迁移提示）。

## 数据/状态流

1. 启动阶段
- `initViTheme(options)` -> engine `init` -> `hydrate` -> `apply`。
- 首次应用将状态同步到 DOM 与本地存储。

2. 运行阶段
- `ThemeDrawer` 或任意调用点触发 `setTheme/setDark`。
- engine 更新单例状态 -> resolver 计算变量 -> applier 写入 -> persistence 持久化。

3. 消费阶段
- `element-plus-mapping` / `workbench-mapping` 继续消费 `--vi-*`。
- 若配置自定义前缀且开启兼容，同步输出 `--vi-*` 与自定义前缀变量。

## 扩展性

- 后续若需引入多实例模式，可在保留默认单例 API 的前提下新增 `createThemeEngine()` 工厂，不破坏现有调用方。
- resolver 可扩展为“变量分组输出”（颜色组、布局组、阴影组），便于增量测试与性能优化。
- applier 可扩展为作用域目标节点注入，以支持实验性局部容器主题。

## Decisions

### 1. 采用全局单例引擎（而非多实例）
- 决策：本次保持单例。
- 理由：当前业务和 Storybook 均为全局主题模型，单例复杂度最低、迁移成本最低。
- 备选：直接切多实例。
  - 未选原因：会引入容器绑定、隔离策略与调试复杂度，超出当前目标。

### 2. `initViTheme` 作为唯一配置入口
- 决策：初始化配置仅在 `initViTheme` 生效。
- 理由：避免配置来源分叉，降低调用歧义。
- 备选：保留双入口长期并存。
  - 未选原因：长期会导致行为不可预测与排障困难。

### 3. 默认开启 `syncDefaultViPrefix`
- 决策：默认 `true`。
- 理由：保证历史依赖 `--vi-*` 的样式不回退，同时支持自定义前缀迁移。
- 备选：默认关闭严格模式。
  - 未选原因：会放大一次性改造成本并引发回归风险。

## Risks / Trade-offs

- [风险] 重构过程中出现主题注入顺序变化导致视觉回归
  -> 缓解：保持现有注入字段与顺序不变，增加 Storybook 回归验证。

- [风险] 兼容期 `useViTheme(options)` 与新约束并存造成误用
  -> 缓解：开发环境输出迁移告警，文档统一改为 `initViTheme` 配置。

- [权衡] 保持 `syncDefaultViPrefix=true` 会增加一次变量写入开销
  -> 收益：兼容改造窗口稳定，避免大规模样式断裂。

## Migration Plan

1. 新增 `resolver/applier/persistence/engine` 内部模块，保持对外 API 不变。
2. 将 `useViTheme` 改为调用单例 engine，保留兼容签名。
3. 将 Storybook 场景中的 `useViTheme(options)` 改为 `useViTheme()`。
4. 文档同步：强调 `initViTheme` 为唯一配置入口。
5. 通过 `pnpm build:vi`、`pnpm build:storybook` 与主题回归场景验收。

回滚策略：
- 若回归不可控，按提交粒度回退到重构前 `use-vi-theme.ts` 单文件实现，并保留现有 `initViTheme` 调用路径。

兼容期说明：
- 当前版本保留 `useViTheme(options)` 兼容入口，但仅用于迁移过渡并输出告警提示。
- 下一版本计划移除 `useViTheme(options)` 的配置语义，仅保留 `useViTheme()` 无参调用。

## Open Questions

- 是否在下一迭代彻底移除 `useViTheme(options)` 入参（仅保留无参签名）。
- 是否在后续版本提供显式“严格前缀模式”（关闭 `syncDefaultViPrefix`）的项目级开关。
