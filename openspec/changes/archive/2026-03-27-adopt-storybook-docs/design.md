## Context

当前 VI 系统已经完成主题抽屉与主题引擎 V1，并通过 Histoire 提供基础预览。  
本次变更目标是将预览/文档入口统一为 Storybook，且移除 Histoire，形成单一入口的文档体系。

约束条件：
- 技术栈保持 `Vue 3 + TypeScript + Vite + Element Plus + Less`。
- 与现有 `@yyxxfe/vi` 包结构保持一致，不改动主题功能契约。
- OpenSpec 产物使用简体中文。

## Goals / Non-Goals

**Goals:**
- 建立 Storybook 唯一入口并稳定运行。
- 迁移现有主题抽屉预览示例到 Storybook。
- 输出 ThemeDrawer 完整 API 文档（Props + 回调钩子 + 使用示例）。
- 删除 Histoire 相关目录、脚本、依赖与文档引用。

**Non-Goals:**
- 不在本次改造中重写主题能力层。
- 不一次性补齐所有组件文档。
- 不强制引入第三方在线可视化托管服务。

## Decisions

### 1. 采用 Storybook（Vue3 + Vite）作为唯一文档入口
- 决策：采用 `@storybook/vue3-vite`。
- 理由：与当前技术栈一致，生态成熟，后续文档扩展能力更强。
- 备选方案：继续以 Histoire 为主入口。
  - 未选原因：长期维护收益不足，且会造成双入口负担。

### 2. 执行“一次切换”策略并移除 Histoire
- 决策：本次变更完成后直接移除 Histoire 入口。
- 理由：避免双维护和团队使用分叉，统一开发与文档流程。
- 备选方案：并行过渡。
  - 未选原因：会延长迁移窗口并增加成本。

### 3. 文档结构采用 CSF + Autodocs
- 决策：核心示例采用 CSF，配合自动文档生成。
- 理由：维护成本可控，后续可扩展到 MDX 深度文档。
- 备选方案：全部手写 MDX。
  - 未选原因：初期迁移工作量大。

### 4. 全局初始化与业务接入对齐
- 决策：在 Storybook preview 全局注册 Element Plus，并执行 `initViTheme()`。
- 理由：确保示例行为与真实项目一致，避免“文档可看不可用”。

## Architecture

- 文档应用层：`apps/storybook`
- 组件来源：`packages/vi`
- 全局装配：`.storybook/preview.ts`（或等效配置文件）
  - 注入 Element Plus
  - 引入 `@yyxxfe/vi` 样式
  - 执行主题初始化
- 示例组织：按组件域分组（如 `Theme/ThemeDrawer`）
- 文档输出：Autodocs + 人工补充 API 章节（Props、回调钩子、接入示例）

## Data / State Flow

1. Storybook 启动加载全局 preview。
2. preview 注册 UI 库并初始化主题状态。
3. story 渲染 `ThemeDrawer` 并通过 `useViTheme` 驱动状态。
4. 用户交互触发主题变化，变量注入路径与业务项目一致。

## Extensibility

- 新增组件仅需新增 stories 文件即可接入文档站。
- 可逐步增加 addon（a11y、interactions、viewport、measure）。
- 后续可接入视觉测试平台，不影响当前目录结构。

## Risks / Trade-offs

- [风险] 一次切换期间可能影响团队预览效率  
  -> [缓解] 在同一迭代内完成脚本、文档和示例同步更新，并提供回滚分支。

- [风险] 主题初始化逻辑在 Storybook 与业务入口不一致  
  -> [缓解] 复用同一初始化 API（`initViTheme`），并提供回归 story。

- [风险] 文档构建体积增大导致 CI 时间上升  
  -> [缓解] 按需启用 addon，分阶段接入重型能力。

## Migration Plan

1. 创建 Storybook 工程及根命令脚本。
2. 接入全局 preview 初始化（Element Plus + VI 主题）。
3. 迁移主题抽屉示例并补充 controls/docs。
4. 输出 ThemeDrawer API 文档（Props + 回调钩子 + 示例）。
5. 删除 Histoire 目录、脚本、依赖与文档引用。

回滚策略：
- 若 Storybook 出现阻断问题，回滚本次迁移提交并恢复上一个稳定版本。

## Open Questions

1. Storybook 首批需要启用哪些 addon（是否默认启用 a11y/interactions）？
2. 是否在本次变更中同步产出一份对外静态文档部署说明？
