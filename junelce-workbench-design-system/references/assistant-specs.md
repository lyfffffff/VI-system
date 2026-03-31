# AI助手抽屉规范

> InsightAds Workbench内嵌AI助手抽屉的CSS变量体系。

## 亮色模式变量

```css
:root {
  /* 壳体 */
  --assistant-shell-bg: linear-gradient(180deg, #fafbff 0%, #f5f7fb 100%);
  --assistant-shell-glow: rgba(var(--el-color-primary-rgb), 0.08);

  /* 侧边栏 */
  --assistant-sidebar-bg: rgba(255, 255, 255, 0.9);
  --assistant-sidebar-border: var(--el-border-color-lighter);

  /* 面板 */
  --assistant-panel-bg: rgba(255, 255, 255, 0.82);
  --assistant-panel-border: rgba(var(--el-color-primary-rgb), 0.08);
  --assistant-panel-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);

  /* 表面 */
  --assistant-surface-bg: rgba(255, 255, 255, 0.9);
  --assistant-surface-strong: #ffffff;
  --assistant-surface-border: rgba(var(--el-color-primary-rgb), 0.14);

  /* 交互状态 */
  --assistant-hover-bg: rgba(var(--el-color-primary-rgb), 0.06);
  --assistant-active-bg: rgba(var(--el-color-primary-rgb), 0.08);

  /* 强调色 */
  --assistant-accent-soft: rgba(var(--el-color-primary-rgb), 0.1);
  --assistant-accent-border: rgba(var(--el-color-primary-rgb), 0.24);
  --assistant-accent-color: var(--el-color-primary);
  --assistant-accent-text: var(--el-color-primary);

  /* 按钮 */
  --assistant-create-btn-bg: linear-gradient(180deg, #ffffff 0%, #f6f8ff 100%);
  --assistant-create-btn-border: rgba(var(--el-color-primary-rgb), 0.2);

  /* 关闭按钮 */
  --assistant-close-bg: rgba(255, 255, 255, 0.78);
  --assistant-close-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);

  /* 输入区 */
  --assistant-composer-bg: rgba(255, 255, 255, 0.9);
  --assistant-input-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  --assistant-send-inner-bg: #ffffff;
}
```

## 暗黑模式变量

```css
html.dark {
  --assistant-shell-bg: linear-gradient(180deg, #141922 0%, #0f1319 100%);
  --assistant-shell-glow: rgba(var(--el-color-primary-rgb), 0.18);
  --assistant-sidebar-bg: rgba(18, 21, 27, 0.9);
  --assistant-sidebar-border: rgba(255, 255, 255, 0.06);
  --assistant-panel-bg: rgba(28, 31, 36, 0.86);
  --assistant-panel-border: rgba(var(--el-color-primary-rgb), 0.18);
  --assistant-panel-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
  --assistant-surface-bg: rgba(28, 31, 36, 0.92);
  --assistant-surface-strong: #191d24;
  --assistant-surface-border: rgba(var(--el-color-primary-rgb), 0.24);
  --assistant-hover-bg: rgba(var(--el-color-primary-rgb), 0.14);
  --assistant-active-bg: rgba(var(--el-color-primary-rgb), 0.2);
  --assistant-accent-soft: rgba(var(--el-color-primary-rgb), 0.18);
  --assistant-accent-border: rgba(var(--el-color-primary-rgb), 0.3);
  --assistant-accent-color: var(--el-color-primary-light-3);
  --assistant-accent-text: var(--el-color-primary-light-3);
  --assistant-create-btn-bg: linear-gradient(180deg, #232934 0%, #1b2029 100%);
  --assistant-create-btn-border: rgba(var(--el-color-primary-rgb), 0.22);
  --assistant-close-bg: rgba(25, 29, 36, 0.92);
  --assistant-close-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
  --assistant-composer-bg: rgba(18, 21, 27, 0.92);
  --assistant-input-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  --assistant-send-inner-bg: #181c22;
}
```

## 设计特点

- 所有颜色引用`var(--el-color-primary-rgb)`，跟随17色主题切换
- 大量使用半透明`rgba`，实现玻璃质感（glassmorphism）
- 暗色模式透明度更高（0.86~0.92），投影更深
- 按钮使用渐变背景（`linear-gradient`），不是纯色
