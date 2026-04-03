## Full Timeline Summary (from change kickoff to archive)

### 0) 初始目标与范围收敛
- 目标确定为：ELP 组件覆盖收敛，减少冗余覆盖，明确全局与作用域边界。
- 输入基线统一为：
  - 原型实现（`ask-data/demo`）
  - 规范文档（`junelce-workbench-design-system/references/*`）

### 1) OpenSpec 变更建立与推进
- 建立并推进 `converge-elp-overrides-scope`。
- 明确覆盖判定规则：
  - 全局差异 -> `.el-*`
  - 业务结构差异 -> `.vi-theme-scope`
- 完成任务、设计、提案、spec 增量，并最终归档。

### 2) 覆盖层清理与最小化
- 对 `overrides`（button/input/select/textarea/table/dialog/drawer/tabs/radio 等）做“仅保留差异”的清理。
- 连续处理了“是否重复覆盖 ELP 默认值”“是否写入了已有变量”等问题。
- 清理后围绕 Storybook 回归持续修正。

### 3) 回归问题定位与修复
- 处理 Storybook 样式问题，重点包含：
  - 日期/选择器背景色不一致
  - 日周月年按钮居中与背景问题
  - 下拉框与日期选择器表现偏差
  - 表格模块不可见（容器滚动/裁剪问题）
- 持续通过视觉回归报告验证（header/menu/history/filter/metrics/chart/table）。

### 4) 原型样式抽取与模块化
- 从 `data-cockpit/index.vue` 抽取 ELP 相关与强原型相关样式。
- 完成 header -> menu -> history-tabs 的模块化拆分与样式对齐。
- 形成并迭代工作流文档：

### 5) 结构重组（样式目录职责拆分）
- 将样式职责从单一覆盖目录拆分为：
  - `packages/vi/src/styles/element-ui/*`
  - `packages/vi/src/styles/workbench/*`
- 目的是把“组件库覆盖”和“业务工作台样式”边界明确化。

### 8) Storybook 预览样式分层
- 将 Storybook 预览样式拆分为：
  - 宿主基础层：`apps/storybook/.storybook/preview.css`
  - 故事演示层：`apps/storybook/.storybook/preview.stories.css`
- 避免 Story 结构样式污染公共主题层。

### 9) 归档与补录
- 已归档 change：`2026-04-02-converge-elp-overrides-scope`
- 已补录：
  - `session-summary-2026-04-02.md`
  - `post-archive-addendum-2026-04-02.md`
  - 本文件 `full-timeline-summary.md`

## 当前状态
- 样式收敛、视觉回归、Storybook 分层已形成可持续流程。
- 主规格已同步增量，归档可追踪。
