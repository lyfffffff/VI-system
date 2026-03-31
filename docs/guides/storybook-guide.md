# Storybook 文档库开发指南

## 启动命令
```bash
pnpm dev:storybook
```

## 构建命令
```bash
pnpm build:storybook
```

## 目录约定
- Storybook 应用目录：`apps/storybook`
- 组件示例目录：`apps/storybook/src/stories`
- 配置目录：`apps/storybook/.storybook`

## Story 命名约定
- 文件命名使用连字符：`theme-drawer.stories.ts`
- `title` 按域分组：`Theme/Theme Drawer`
- 至少包含：`Playground` + 回归场景。

## ThemeDrawer 推荐场景矩阵
- `Playground`：基础交互。
- `ThemeRegression`：亮/暗 + 17 主题切换。
- `ComponentRegression`：按钮、输入、选择器、表格、抽屉、标签页/单选。
- `PrefixAndScopedOverride`：自定义 prefix + 局部覆盖作用域。

## 文档输出要求
- 必须在 Storybook Docs 中补齐 Props（类型、默认值、说明）。
- 必须在 Storybook Docs 中补齐回调钩子（触发时机、参数签名）。
- 必须提供一段可直接复制的接入示例代码。
- 必须说明主题扩展优先级：`CSS var > 业务 class > 直接覆盖组件内部样式`。
