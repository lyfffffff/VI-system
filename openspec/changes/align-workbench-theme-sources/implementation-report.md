## Implementation Report (2026-04-08)

### 1. Input Baseline (Whitelist)

- `junelce-workbench-design-system`（规范来源）
- `workbench-theme`：`F:/web_git_frontend/ask-data/demo/src/styles/workbench-theme.css`（实现来源）

### 2. Frozen Decisions Applied

- 默认色：`Teal #14b8a6`
- 控件圆角：页面全局 `10px`，弹窗/抽屉内 `6px`
- Topbar 高度：`56px`

### 3. A Layer Applied (`tokens.less`)

- 已修正暗色 `surface/text/border/fill` 相关 token 偏差。
- 已拆分 `success` 明暗 token（`@vi-token-success-light` / `@vi-token-success-dark`）。
- 已下调暗色阴影强度到 `workbench-theme` 对齐值。

来源归属：
- 数值基线来自 `workbench-theme.css`（实现事实）
- 圆角与默认色采用已裁决口径（design-system + 实现裁决）

### 4. B Layer Applied (`semantic + mapping`)

- `semantic-vars.less`
  - `--vi-layout-topbar-height` 调整为 `56px`
  - 文本语义层级拆分：`primary/regular/secondary/muted/disabled`
  - 增补 border/fill 扩展语义，避免 `element` 与 `workbench` 混用同一语义造成漂移
- `element-plus-mapping.less`
  - 修正 text 映射层级
  - 修正 border/fill 映射层级
  - 表格 hover/current-row 强度回归
  - 补齐缺失 `--el-*` 变量（见下一节）
- `workbench-mapping.less`
  - 修正暗色 `panel/surface` 语义位
  - 修正 `overlay`、`input-border`、`theme-drawer`、`close-hover-bg` 映射

### 5. C Layer Applied (Missing Variables Policy)

#### 5.1 `--el-*` 缺失补齐（已执行）

- `--el-border-color-darker`
- `--el-border-color-extra-light`
- `--el-fill-color-darker`
- `--el-fill-color-extra-light`

#### 5.2 `--wb-*` 缺失项扫描（先用后补）

扫描范围：`packages/**`、`apps/**`  
扫描结果：本轮缺失 `--wb-*` 项未发现项目内真实引用点。  
执行决策：不补全未引用项，保留后续按需补齐。

### 6. Verification Summary

- `pnpm -C packages/vi build`：通过
- `pnpm -C apps/storybook build`：通过

已验证：
- 样式链路可构建（Less/CSS 无语法阻断）
- Storybook 打包通过（可用于后续可视化回归）

未自动化验证：
- 交互态截图级比对（hover/focus/active/disabled）
- 逐模块人工视觉验收

### 7. OpenSpec Remaining Tasks

- `5.1`：`Theme/Prototype Regression` 亮/暗模式人工视觉回归（待执行）
- `5.2`：关键交互态截图记录（待执行）

---

## Incremental Report (2026-04-09)

### A. 本轮增量提交摘要（915cf10 / 59fdde0 / 701ddb0）

1. Storybook 联调链路增强  
   - 在 `.storybook/main.ts` 增加 workspace alias：`@yyxxfe/vi` 与 `@yyxxfe/vi/styles` 指向 `packages/vi/src/index.ts`。  
   - 扩展 `server.fs.allow`，放开 Storybook 工程根与仓库根目录读取。

2. Story 样式归属收敛  
   - 移除 `.storybook/story-styles/*`。  
   - 将 `theme-drawer` 与 `data-cockpit` 的 story 页面样式迁移到对应 `.vue`。

3. Data Cockpit 原型模块化  
   - `prototype-*` 组件重命名并拆分为：`app-header`、`app-menu`、`app-history-nav`、`conditions-panel`、`metrics-panel`、`chart-panel`、`table-panel`。  
   - `mock-data.ts` 扩展为页面级与组件级统一数据契约。

4. 主题算法与映射细节修正  
   - `getThemeVariants(hex, isDark)` 支持暗色分支混色策略；`theme-resolver` 传入 `isDark`。  
   - `table` hover 变量链路收敛到组件层回写，避免 EP 本地变量覆盖导致的 fixed-column 透底问题。  
   - `workbench-overrides` 引入 `date-picker.less` 与 `ai-assistant.less`，并清理部分无效入口。

### B. 增量执行结论

- `proposal/design/tasks/spec` 已同步增量条目。  
- `tasks` 新增第 6 组“增量执行（2026-04-09）”并标记完成。  
- 仍保留人工视觉回归待办：
  - `5.1` 亮/暗模式全场景核验
  - `5.2` 交互态截图归档
