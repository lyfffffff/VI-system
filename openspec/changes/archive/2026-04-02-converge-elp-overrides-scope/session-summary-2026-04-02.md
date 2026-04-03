## Session Summary (2026-04-02)

### 本轮完成
- 完成 Storybook 预览样式分层：
  - `apps/storybook/.storybook/preview.css` 收敛为宿主基础样式
  - 新增 `apps/storybook/.storybook/preview.stories.css` 承载 Story/演示样式
  - 在 `preview.ts` 中按层引入两份样式文件

### 本轮验证
- `pnpm --filter @vi/storybook build` 通过

### 关键决策
- 变量分层治理采用“映射优先、直写例外白名单”。
- `semantic` 层允许语义化直写（如渐变、暗黑补偿）；`mapping` 层默认只允许 `var(--vi-*)` 映射。
- `preview` 样式按“宿主基础层 / Story 演示层”拆分，避免 Storybook 壳层样式污染公共主题层。

### 当前边界说明
- 仍存在少量具体值属于已登记例外（可访问性或框架兼容场景），并受白名单约束。
- 后续可按重复值频率，将例外值逐步上提至 `--vi-*` 语义变量。

### 建议下一步
- 对 `preview.stories.css` 做第二轮收敛：把可公共复用的规则回迁至 `packages/vi/src/styles/*`。
- 优先处理 `--vi-on-primary` / overlay 相关语义变量上提，减少 mapping 层白名单数量。
