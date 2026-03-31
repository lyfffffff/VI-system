## 1. Storybook 工程接入（主入口）

- [x] 1.1 新增 Storybook 应用目录与基础配置（Vue3 + Vite）。
- [x] 1.2 在根 `package.json` 增加 `dev:storybook`、`build:storybook`、`preview:storybook` 脚本。
- [x] 1.3 安装并锁定 Storybook 相关依赖，更新 lockfile。

## 2. 全局初始化与主题对齐

- [x] 2.1 在 Storybook preview 中注册 Element Plus。
- [x] 2.2 在 Storybook preview 中引入 `@yyxxfe/vi` 样式并执行 `initViTheme()`。
- [x] 2.3 确认 Storybook 环境下 `useViTheme` 的状态持久化与暗黑模式切换可用。

## 3. ThemeDrawer 示例与文档输出

- [x] 3.1 将现有 `theme-drawer` 预览从 Histoire 迁移为 Storybook story（CSF）。
- [x] 3.2 补充主要 controls（`open`、`placement`、`themes`）。
- [x] 3.3 补充 `ThemeDrawer` Props 文档（字段、类型、默认值、说明）。
- [x] 3.4 补充 `ThemeDrawer` 回调钩子文档（`update:open`、`theme-change`、`mode-change` 的触发时机与参数签名）。
- [x] 3.5 补充“页面接入示例”，展示 `v-model:open` 与事件监听的完整代码。

## 4. 移除 Histoire

- [x] 4.1 删除 `apps/histoire` 目录及其配置文件。
- [x] 4.2 移除根脚本中的 `dev:histoire`、`build:histoire`、`preview:histoire`。
- [x] 4.3 清理 Histoire 依赖与 lockfile 残留。
- [x] 4.4 清理仓库文档中的 Histoire 启动说明与引用。

## 5. 文档与规范更新

- [x] 5.1 更新 `docs/guides/theme-drawer-integration.md`，将预览入口统一为 Storybook。
- [x] 5.2 新增/更新 `ThemeDrawer API` 文档章节，确保 Props 与回调钩子说明可直接用于接入。
- [x] 5.3 在 OpenSpec 规范中明确“Storybook 为唯一文档预览入口”。

## 6. 验证与收口

- [x] 6.1 执行 `pnpm dev:storybook` 验证本地启动。
- [x] 6.2 执行 `pnpm build:storybook` 验证静态构建。
- [x] 6.3 执行关键字扫描（`histoire`）确认仓库无残留引用（归档目录除外）。

