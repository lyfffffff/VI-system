# Storybook 文档库开发指南

## 启动与构建

仓库根目录命令：

```bash
pnpm dev:storybook
pnpm build:storybook
pnpm preview:storybook
```

Storybook 应用命令（`apps/storybook/package.json`）：

```bash
pnpm --filter @vi/storybook dev
pnpm --filter @vi/storybook build
pnpm --filter @vi/storybook preview
```

## 目录结构（当前）

- 应用目录：`apps/storybook`
- 配置目录：`apps/storybook/.storybook`
- 配置文件：
  - `main.ts`：stories 入口、addons、framework、vite 配置
  - `preview.ts`：全局 setup、decorator、controls 参数
  - `preview.css`：预览宿主基础样式
  - `preview.stories.css`：story 演示样式
- 示例目录：`apps/storybook/src/stories`
  - `theme-drawer.stories.ts`
  - `prototype-regression.stories.ts`
  - `prototype-regression/*.vue`（原型回归拆分子组件）

## Story 与分组（当前）

- `title: "主题/主题抽屉"`（`theme-drawer.stories.ts`）
  - `Playground`
  - `ThemeVariantSwatches`
  - `ThemeRegression`
- `title: "主题/原型回归"`（`prototype-regression.stories.ts`）
  - `DataCockpitPrototype`

## 配置约束（当前）

- `main.ts`
  - `stories`：`../src/**/*.stories.@(ts|tsx|js|jsx|mjs)`
  - `addons`：`@storybook/addon-essentials`、`@storybook/addon-interactions`
  - `framework`：`@storybook/vue3-vite`
  - `docs.autodocs`：`tag`
- `preview.ts`
  - 注册 `ElementPlus`
  - 初始化 `initViTheme({ prefix: "vi" })`
  - 通过 `themeMode`（light/dark）toolbar + decorator 同步全局主题模式

## 维护要求

- 新增或调整 story 时，必须同步更新本文件中的“Story 与分组（当前）”。
- 仅将通用预览样式放在 `preview.css`；故事特有样式放在 `preview.stories.css`。
- Docs 描述需与实际导出场景一致，不保留已删除场景的文案。
