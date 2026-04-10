## Why

当前样式细节在不同页面与组件间仍存在不一致，且参考来源混杂，导致“改一处、漂多处”的回归风险较高。  
本次需要先收敛输入基线：仅允许以 `junelce-workbench-design-system` 与原型源码 `workbench-theme` 作为样式事实来源，再开展统一化调优。

### 背景
- 现状：VI 主题链路已成型，但细节层（间距、字重、边框、状态色、暗黑态）仍有偏差。
- 问题：样式对齐时引用来源不统一，验收口径不稳定。
- 机会：在进入样式细节调优前，先建立“唯一输入来源 + 回归口径”约束，可显著降低后续维护成本。

### 目标
- 建立样式调优输入白名单：仅 `junelce-workbench-design-system` 与 `workbench-theme`。
- 对齐 `token -> semantic -> mapping -> overrides` 各层细节，消除跨模块不一致。
- 形成可执行的回归清单（Storybook 场景 + 模块级校验项）。

### 范围
- 包含：`packages/vi/src/styles/*` 的细节统一化调优。
- 包含：与样式契约相关的 Storybook 原型回归场景校准。
- 包含：文档中“样式来源与验收口径”的同步更新。

### 非目标
- 不新增主题预设数量与主题算法能力。
- 不扩展新的业务功能模块。
- 不引入第三方设计规范作为额外输入来源。

### 验收标准
- 样式调优需求可追溯到两类输入源之一（无第三来源）。
- 核心模块在亮/暗模式下通过 Storybook 回归检查，视觉基线一致。
- 变量层优先原则保持成立，覆盖层仅保留最小差异。

## What Changes

- 新增“样式输入来源治理”约束：仅允许 `junelce-workbench-design-system` 与 `workbench-theme`。
- 以输入白名单为基线，分层校准 `tokens/semantic/mapping/overrides` 细节。
- 对 `Theme/Prototype Regression` 场景增加模块级对齐检查与验收记录。
- 同步更新规范文档，明确“输入来源、比对方法、回归口径”。
- 文档收敛到单一总结入口：保留 `总结.md` 作为团队主阅读文档，移除冗余说明文档。
- 移除非主题核心导出 `use-auto-table-col-width`，收敛 `@yyxxfe/vi` 公共 API 到主题能力本身。
- 将 `data-cockpit-prototype/table-panel` 的列宽策略改为静态配置，移除对自动测量列宽逻辑的依赖。
- 在 `README.md` 增补“使用主题组件”简要步骤，明确 `initViTheme + ThemeDrawer + useViTheme` 最小接入方式。
- 增量补充 Storybook 联调链路：`@yyxxfe/vi` 与 `@yyxxfe/vi/styles` 在开发态指向 `packages/vi/src/index.ts`，避免仅消费 `dist` 导致的调试偏差。
- 增量补充 Story 样式归属：将 `theme-drawer` 与 `data-cockpit` Story 的页面样式迁移到对应 `.vue` 文件内，移除 `.storybook/story-styles/*` 的分散入口。
- 增量补充原型拆分约束：`data-cockpit-prototype` 拆分为 `header/menu/history/conditions/metrics/chart/table` 组件，统一由 `mock-data.ts` 提供页面级与组件级数据。
- 增量补充主题算法与表格规则：暗色主题色阶改为暗底混色；表格 hover 色在 `el-table` 层强制回写不透明变量，避免固定列滚动穿透。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `theme-system`: 增加“样式调优输入来源白名单”与“细节统一化回归口径”要求。
- `component-docs`: 增加“文档主入口收敛”与“Story 文档同步总结文档”要求。

## Impact

- **受影响代码**
  - `apps/storybook/.storybook/main.ts`
  - `apps/storybook/.storybook/preview.ts`
  - `apps/storybook/src/stories/theme-drawer/*.vue`
  - `apps/storybook/src/stories/data-cockpit-prototype/*`
  - `packages/vi/src/styles/tokens.less`
  - `packages/vi/src/styles/semantic-vars.less`
  - `packages/vi/src/styles/element-plus-mapping.less`
  - `packages/vi/src/styles/workbench-mapping.less`
  - `packages/vi/src/styles/workbench-overrides.less`
  - `packages/vi/src/styles/element-ui/*.less`
  - `packages/vi/src/styles/workbench/*.less`
  - `packages/vi/src/theme/theme-resolver.ts`
  - `packages/vi/src/utils/color-utils.ts`
  - `packages/vi/src/index.ts`
  - `packages/vi/src/composables/use-auto-table-col-width.ts`（移除）
  - `apps/storybook/src/stories/data-cockpit-prototype/table-panel.vue`
  - `README.md`
  - `总结.md`
  - `VI-System.md`（移除）
  - `docs/guides/*.md`（移除）
- **受影响系统**
  - VI 主题样式分层体系
  - Storybook 原型回归链路
  - 组件文档维护流程
- **依赖影响**
  - 无新增运行时依赖
