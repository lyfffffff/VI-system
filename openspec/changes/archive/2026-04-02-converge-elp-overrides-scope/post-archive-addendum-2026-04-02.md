## Post-Archive Addendum (2026-04-02)

### 说明：为什么看起来“没有归档全部对话”
OpenSpec 归档的是 **change 工件与规格增量**，不是完整聊天记录或自动抓取的全仓库变更日志。
因此如果某些实现内容未在当次 `proposal/design/specs/tasks` 中显式记载，就不会在归档摘要中自动出现。

本补录用于把本轮对话里已实施、但在主工件中表达不足的内容进行追记。

## A. 覆盖目录结构拆分（overrides -> element-ui / workbench）

### 已执行内容
- 样式覆盖从单一 `overrides` 目录按职责拆分到：
  - `packages/vi/src/styles/element-ui/*`
  - `packages/vi/src/styles/workbench/*`
- 目标：将 ELP 组件覆盖与业务工作台样式分层管理，降低规则耦合。

### 关联文件（示例）
- `packages/vi/src/styles/workbench/layout.less`
- `packages/vi/src/styles/workbench/filter.less`
- `packages/vi/src/styles/workbench/chart.less`
- `packages/vi/src/styles/element-ui/input.less`
- `packages/vi/src/styles/element-ui/radio.less`

## B. 原型图还原标准与流程

### 已执行内容
- 建立并持续使用“模块化还原工作流”，用于从 header/menu/history-tabs 到 page modules 的一致化收敛。
- 形成可复用校验清单与视觉回归流程文档。

### 关联文档

## C. Playwright 视觉回归链路

### 已执行内容
- 建立原型 vs Storybook 的视觉回归脚本与配置，支持场景化截图对比与 diff 报告。
- 提供命令入口：`pnpm visual:compare`

### 关联文件
- `scripts/visual-regression/prototype-vs-storybook.mjs`
- `scripts/visual-regression/prototype-vs-storybook.config.mjs`
- `package.json`（`visual:compare`）

## D. 与本次归档 change 的关系
- 本补录内容与 `converge-elp-overrides-scope` 的目标一致（样式收敛与回归可控）。
- 其中部分条目属于“实施细节与工程化支撑”，未完整体现在该 change 的主规格增量中，故在此追记。
