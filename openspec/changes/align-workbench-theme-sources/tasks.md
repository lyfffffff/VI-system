## 1. 基线与裁决冻结

- [x] 1.1 固化输入白名单：仅 `junelce-workbench-design-system` 与 `workbench-theme`，并在实施记录中标注每项差异来源。
- [x] 1.2 固化三项裁决：默认色 `Teal #14b8a6`；全局控件圆角 `10px`（弹窗/抽屉 `6px`）；Topbar 高度 `56px`。
- [x] 1.3 产出本轮执行基线：采纳 A（token 差异）、B（映射差异）、C（缺失变量补全策略）。

## 2. A 层执行：tokens 差异修正（47 项中 14 项）

- [x] 2.1 修正暗色基础 token：`surface/text/border/fill` 与 `workbench-theme` 对齐。
- [x] 2.2 修正状态与阴影 token：`success` 明暗分离、`panel/card/popover` 暗色阴影强度对齐。
- [x] 2.3 复核 `tokens -> semantic` 传导结果，确保无反向覆盖导致的回退。

## 3. B 层执行：semantic + mapping 差异修正（17 项）

- [x] 3.1 修正 `semantic-vars.less` 关键偏差：`--vi-layout-topbar-height` 设为 `56px`，并校正文本层级语义映射。
- [x] 3.2 修正 `element-plus-mapping.less` 偏差：文本层级、边框层级、填充层级、表格 hover 强度。
- [x] 3.3 修正 `workbench-mapping.less` 偏差：暗色 `panel/surface` 语义位、`overlay`、`input-border`、`theme-drawer` 等变量映射。

## 4. C 层执行：缺失变量补全（按裁决收敛）

- [x] 4.1 补全 `--el-*` 缺失项（本轮固定 4 项）：`--el-border-color-darker`、`--el-border-color-extra-light`、`--el-fill-color-darker`、`--el-fill-color-extra-light`。
- [x] 4.2 对 `--wb-*` 缺失项执行“先用后补”扫描：仅统计 `packages/**`、`apps/**` 的真实引用点。
- [x] 4.3 仅补全“已被项目使用”的 `--wb-*` 缺失变量；未被引用项保留为待补（不在本轮引入）。
- [x] 4.4 在变更记录中附本轮扫描结果（变量名、引用文件、补全去留决策）。

## 5. 回归与验收

- [ ] 5.1 在 `Theme/Prototype Regression` 场景执行亮/暗模式回归，覆盖核心页面与控件。
- [ ] 5.2 执行关键交互态检查：`hover/focus/active/disabled`，记录通过/失败项及截图。
- [x] 5.3 校验 `tokens -> semantic -> mapping -> overrides` 分层顺序未被破坏，确保覆盖层仅保留最小兜底。
- [x] 5.4 输出本轮验收结论：已收敛项、剩余差异项、下一轮建议。

## 6. 增量执行（2026-04-09）

- [x] 6.1 Storybook 开发态 alias 到 `packages/vi/src/index.ts`，并补充 workspace 读盘 allow，确保源码联调不依赖 `dist`。
- [x] 6.2 清理 `.storybook/story-styles/*`，将 `theme-drawer` 与 `data-cockpit` 的故事样式迁移到对应 `.vue`，减少全局样式串扰。
- [x] 6.3 将 `data-cockpit-prototype` 拆分为独立模块组件（`header/menu/history/conditions/metrics/chart/table`），并统一 `mock-data.ts` 数据契约。
- [x] 6.4 修正暗色主题色阶算法：`getThemeVariants` 增加 `isDark` 分支，`theme-resolver` 按模式传参。
- [x] 6.5 修正表格 hover 变量优先级链路：在 `.el-table` 层回写 `--el-table-row-hover-bg-color`，避免固定列滚动穿透。
- [x] 6.6 扩充 ThemeDrawer 回归样例（页面内展示 + 弹窗展示 + 禁用态/多类型表格），提升视觉回归覆盖度。
