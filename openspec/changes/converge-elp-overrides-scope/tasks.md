## 1. OpenSpec 任务建立

- [x] 1.1 新建 `converge-elp-overrides-scope` change，并补齐 proposal/design/specs/tasks 文档。
- [x] 1.2 在文档中明确“全局 `.el-*` / 作用域 `.vi-theme-scope`”分层规则与验收口径。

## 2. 覆盖规则收敛

- [x] 2.1 对 `overrides/button.less`、`input.less`、`select.less`、`textarea.less`、`table.less` 按原型差异收敛并区分全局/作用域。
- [x] 2.2 对 `overrides/dialog.less`、`drawer.less`、`tabs.less`、`radio.less` 按原型差异收敛并区分全局/作用域。
- [x] 2.3 清理多容器混合作用域，仅保留 `.vi-theme-scope` 作为作用域覆盖容器。

## 3. 验证与回填

- [x] 3.1 执行 `pnpm build:vi` 验证构建通过。
- [x] 3.2 同步更新任务状态，记录本轮收敛结果。

