## Context

当前 VI 主题系统已具备完整分层（`tokens -> semantic -> mapping -> overrides`），但样式细节调优阶段存在“输入来源分散”问题：同一类视觉差异可能被不同文档、不同页面快照、不同临时样式同时影响，导致回归口径不稳定。  
本次变更聚焦建立统一输入基线：仅允许 `junelce-workbench-design-system` 与原型源码 `workbench-theme` 作为事实来源，再执行样式细节统一。

约束：
- 技术栈保持 `Vue 3 + TypeScript + Less + Element Plus`；
- 不新增主题功能，只做样式细节一致性收敛；
- 继续遵守“变量优先、覆盖兜底”的既有主题治理规则。

## Goals / Non-Goals

**Goals:**
- 建立输入来源白名单并落地到调优流程与验收标准。
- 统一 `tokens/semantic/mapping/overrides` 四层样式细节，降低跨模块漂移。
- 在 Storybook 原型回归场景中形成可重复执行的对齐检查清单。

**Non-Goals:**
- 不引入新的设计规范源或第三方主题标准。
- 不改动主题预设数量、主题算法或主题状态 API。
- 不扩展新业务模块，仅收敛现有模块样式。

## Decisions

### 1. 输入来源白名单化（流程层硬约束）
- 决策：样式调优仅接受两类输入：
  - `junelce-workbench-design-system`（规范输入）
  - 原型源码 `workbench-theme`（实现输入）
- 理由：减少“多真相源”带来的偏差与返工。
- 备选：继续允许按需引用其他页面/临时样式。
  - 未选原因：可追溯性差，难以建立稳定回归口径。

### 2. 分层统一按固定顺序执行
- 决策：统一顺序为 `tokens -> semantic -> mapping -> overrides`。
- 理由：将可变量化差异前置解决，降低覆盖层膨胀风险。
- 备选：直接在 `overrides` 快速修补。
  - 未选原因：短期快、长期难维护，且容易破坏主题一致性。

### 3. Storybook 作为唯一可视化验收面
- 决策：以 `Theme/Prototype Regression` 作为主要回归入口，按模块记录差异与收敛结果。
- 理由：可视化最直接，且已是项目内现有验收基础设施。
- 备选：仅通过代码 diff 与 Less 对比验收。
  - 未选原因：无法直观看出交互态与暗黑态差异。

### 4. Storybook 开发态强制走源码联调
- 决策：在 Storybook `viteFinal` 中将 `@yyxxfe/vi` 与 `@yyxxfe/vi/styles` alias 到 `packages/vi/src/index.ts`，并放开 workspace 根目录读盘权限。
- 理由：避免 Storybook 仅消费 `dist` 产物导致“源码已改、预览未跟”的调试假象。
- 备选：继续依赖包导出默认走 `dist`。
  - 未选原因：本轮高频样式细节调优需要源码级即时反馈，`dist` 链路会放大验证延迟。

### 5. Story 样式本地化归属
- 决策：将 `theme-drawer` 与 `data-cockpit` 的 Story 专用样式迁移到对应 `.vue`，并移除 `.storybook/story-styles/*` 作为主入口。
- 理由：样式与模板同文件维护，减少全局样式漂移与故事间串扰。
- 备选：继续集中放在 `.storybook/story-styles`。
  - 未选原因：在多故事并行迭代时，可追溯性弱，回归时难定位归属。

### 6. 原型拆分为模块化组件
- 决策：将 `data-cockpit-prototype` 页拆分为 `app-header/app-menu/app-history-nav/conditions-panel/metrics-panel/chart-panel/table-panel`，统一由 `mock-data.ts` 提供数据契约。
- 理由：模块边界清晰后，样式偏差可按模块回归，避免“大页面一次性联动”降低定位效率。
- 备选：维持单文件大模板。
  - 未选原因：单文件结构使样式与交互耦合过高，不利于持续增量调优。

### 7. 主题色阶暗色模式独立计算
- 决策：`getThemeVariants` 增加 `isDark` 参数，暗色模式下 `light3/light5/light7/light8/light9` 改为暗底混色，并在 resolver 中显式传入 `isDark`。
- 理由：亮色混白算法在暗黑模式下对比不稳定，无法贴合原型的暗色色阶表现。
- 备选：继续复用同一套亮色混白算法。
  - 未选原因：暗黑模式下视觉会偏灰或发脏，主题切换一致性不足。

### 8. 表格 hover 变量在组件层回写
- 决策：保留 `mapping` 层统一定义，但在 `.el-table` 层显式回写 `--el-table-row-hover-bg-color` 为不透明色变量，覆盖 EP 在 `.el-table` 自身的默认变量定义。
- 理由：EP 在组件层本地变量优先级高于 `:root` 继承值；仅改映射层会在固定列滚动时出现穿透。
- 备选：仅在 `:root` 修改 `--el-table-row-hover-bg-color`。
  - 未选原因：会被 EP `.el-table { --el-table-row-hover-bg-color: ... }` 覆盖，实际不生效。

## 架构方案

本次不新增架构层，只在现有链路增加“输入约束 + 校准流程”：
1. 输入采集层：仅采集两类白名单来源。
2. 规范映射层：将输入差异映射到 `token/semantic/mapping/overrides` 对应层。
3. 回归验证层：在 Storybook 原型场景验证模块一致性（亮/暗、交互态）。

## 数据/状态流

1. 差异发现：在 Storybook 场景定位视觉差异。
2. 来源追溯：为每项差异标注来源（design-system 或 workbench-theme）。
3. 分层修正：按 `tokens -> semantic -> mapping -> overrides` 逐层落位。
4. Storybook 联调：开发态直接消费 `packages/vi/src`，确保改动即时生效。
5. 回归验收：按拆分后的模块组件执行亮/暗与交互态核验。
4. 运行时验证：通过主题引擎注入链路验证亮/暗与主题切换一致性。
5. 回归闭环：记录修正项与验收结果，避免重复漂移。

## 扩展性

- 后续新增模块时可复用同一“来源白名单 + 分层落位 + 回归清单”方法。
- 若未来新增规范源，可通过变更评审显式扩展白名单，而非隐式接入。

## Risks / Trade-offs

- [风险] `workbench-theme` 源码版本更新频繁，导致基线抖动  
  -> [缓解] 每轮调优固定基线快照（版本/提交号）再实施。

- [风险] 变量层承载不足，诱发覆盖层临时补丁增多  
  -> [缓解] 优先补齐 `semantic/mapping`，将覆盖层限制为最小差异集。

- [风险] 仅看静态界面可能漏掉交互态差异  
  -> [缓解] 回归清单强制包含 hover/focus/active/disabled 与暗黑态。

- [权衡] 增加来源追溯步骤会提高单次调优成本  
  -> [收益] 长期维护成本下降，回归定位更稳定。

## Migration Plan

1. 在变更内声明并固化输入白名单约束。
2. 基于白名单完成当前样式差异清点并分层归类。
3. 分批实施样式对齐（先变量层，后覆盖层）。
4. 在 Storybook 完成模块级回归验收并记录结果。
5. 同步更新文档与规范说明，形成团队可复用流程。

回滚策略：
- 若本轮对齐引入大面积回归，按样式层级回滚（优先回滚 overrides，再回滚 mapping/semantic），保持主题引擎行为不变。

## Open Questions

1. `workbench-theme` 的基线快照以文件版本号还是提交 hash 作为记录主键？
2. 模块级回归是按“页面模块”还是“组件族”维度出具最终验收报告？
