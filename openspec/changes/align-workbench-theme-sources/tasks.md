## 1. 输入基线与差异清点

- [ ] 1.1 建立样式调优输入白名单清单（`junelce-workbench-design-system`、`workbench-theme`）并写入变更说明。
- [ ] 1.2 对现有待调优样式项做差异盘点，并为每项标注来源归属（design-system 或 workbench-theme）。
- [ ] 1.3 清理无法追溯到白名单来源的候选样式项，形成可执行调优列表。

## 2. 分层样式统一实施

- [ ] 2.1 按 `tokens -> semantic -> mapping` 顺序完成可变量化差异修正。
- [ ] 2.2 对确实无法变量化的差异，在 `overrides` 层补充最小兜底规则并附来源标注。
- [ ] 2.3 复核 `element-ui/*.less` 与 `workbench/*.less`，移除重复或与白名单不一致的规则。

## 3. 原型回归与验收

- [ ] 3.1 在 `Theme/Prototype Regression` 场景验证核心模块的亮/暗模式一致性。
- [ ] 3.2 补充并执行关键交互态回归（hover/focus/active/disabled）检查。
- [ ] 3.3 记录本轮回归结果与剩余差异项，输出可追溯验收结论。

## 4. 文档与规范同步

- [ ] 4.1 更新 `docs/guides` 中样式调优流程说明，明确输入来源白名单约束。
- [ ] 4.2 同步维护 Storybook 场景说明，确保回归口径与本次变更一致。
- [ ] 4.3 校验 OpenSpec 变更产物（proposal/design/specs/tasks）的一致性与可执行性。
