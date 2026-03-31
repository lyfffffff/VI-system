---
name: junelce-workbench-design-system
description: Vue3 + Element Plus B端系统设计规范（默认标准）。所有新建页面、组件、Demo项目必须遵循本规范。触发场景包括但不限于：(1) 新建Vue3页面或组件 (2) 修改现有页面布局或样式 (3) 新建Vue3+Element Plus项目 (4) 用户提到"设计规范"、"design system"、"页面开发"、"做个Demo"、"workbench"。注意：这是当前唯一的默认B端设计规范，除非用户明确要求使用"传统版"或"旧版"规范，否则一律使用本规范。
---

# Junelce Workbench Design System

现代化B端Workbench设计规范，基于 Vue 3 + Element Plus + Tailwind CSS。
与传统 `junelce-design-system`（teal主色、4px圆角、紧凑型）不同，本规范强调**柔和圆角、微投影面板、渐变背景、动态主题切换**。

> **参考实现**：`prototypes/vue3-demos/insightads_workbench_demo/`、`askdata_workbench_demo/`

### 详细规范索引（references/）

本SKILL.md包含核心设计决策和常用样式。**更详细的规范**按场景拆分到references目录，按需查阅：

| 文件 | 内容 | 何时查阅 |
|------|------|----------|
| `references/layout-specs.md` | Topbar、Sidebar、TagsView、主题切换、暗黑模式、首页全屏模式 | 搭建整体布局框架、配置主题切换、实现暗黑模式时 |
| `references/component-specs.md` | 按钮、表单、表格、Tag、下拉、分页、Checkbox、Tree、Radio、指标卡（MetricCard） | 开发具体组件、需要尺寸/间距/状态样式细节时 |
| `references/dialog-specs.md` | 弹窗/抽屉结构、圆角差异、三列选择弹窗、动态行配置、确认弹窗 | 开发弹窗/抽屉类功能时 |
| `references/login-specs.md` | 登录页布局、双层卡片、扫码/密码模式、品牌轮播、表单验证动画 | 开发或修改登录页时 |
| `references/skeleton-specs.md` | 骨架屏、图表加载动画、vue3-count-to数值动画、页面过渡、水印、响应式断点 | 处理加载状态、数值动画、水印配置时 |
| `references/assistant-specs.md` | AI助手抽屉的CSS变量（亮色/暗色） | 开发AI助手相关功能时 |
| `references/table-auto-width.md` | 表格自动列宽计算（Canvas测量方案） | 开发数据表格、需要列宽根据内容自适应时 |

## 核心设计决策

| 维度        | 决策                                |
| ----------- | ----------------------------------- |
| 默认主色    | Teal `#14b8a6`（支持17色动态切换）  |
| 圆角体系    | xl=14px, lg=12px, md=10px, sm=8px   |
| 面板样式    | 白色+微投影 `wb-soft-panel`         |
| 页面背景    | 渐变色 + 色彩晕染（`--wb-page-bg`） |
| 按钮/输入框 | 10px圆角（弹窗内6px）               |
| 顶栏高度    | 64px                                |
| 侧边栏宽度  | 192px（折叠56px）                   |
| 字号基准    | 14px正文 / 12px表格 / 13px菜单      |

## 与传统Design System对比

| 维度     | 传统 `junelce-design-system` | 本规范 `workbench`         |
| -------- | ---------------------------- | -------------------------- |
| 主色     | Teal `#14b8a6` 固定          | 17色可选，默认Teal         |
| 圆角     | 4px 统一                     | 8-14px分级（按钮/输入框10px）|
| 布局     | 侧边栏+导航栏+标签栏         | 顶部导航+侧边栏+标签栏     |
| 面板     | `border: 1px solid`          | `box-shadow: 0 1px 2px`    |
| 页面背景 | 纯色 `#f2f3f5`               | 渐变+径向晕染              |
| 暗黑模式 | html.dark + CSS变量          | 同上，额外有主题切换Drawer |

## 设计Token体系（CSS变量）

### 颜色Token

```css
:root {
  /* Element Plus 主色（默认Teal，支持17色动态切换） */
  --el-color-primary: #14b8a6;
  --el-color-primary-rgb: 20, 184, 166;
  --el-color-primary-light-3: #6dd4c8;
  --el-color-primary-light-5: #8adcd3;
  --el-color-primary-light-7: #b7ebe5;
  --el-color-primary-light-8: #ccf1ec;
  --el-color-primary-light-9: #e2f7f4;
  --el-color-primary-dark-2: #12a292;

  /* 文本色（蓝灰色调，区别于EP默认的纯灰） */
  --el-text-color-primary: #23345f;
  --el-text-color-regular: #415175;
  --el-text-color-secondary: #7d8aa5;
  --el-text-color-placeholder: #a4afc3;

  /* 背景色 */
  --el-bg-color: #ffffff;
  --el-bg-color-page: #f5f7fb;
  --el-fill-color: #f5f7fb;
  --el-fill-color-light: #f8f9fc;

  /* 边框色（更浅更柔和） */
  --el-border-color: #e2e7f0;
  --el-border-color-light: #eaedf4;
  --el-border-color-lighter: #f0f3f8;
}
```

### Workbench专属Token（`--wb-*`）

```css
:root {
  /* ── 页面背景 ─────────────────────── */
  --wb-page-bg: radial-gradient(circle at top right, rgba(201,215,255,0.55), transparent 32%),
                linear-gradient(180deg, #eef3fb 0%, #f4f7fc 48%, #f6f8fb 100%);
  --wb-app-bg: transparent;
  --wb-topbar-bg: transparent;
  --wb-sidebar-bg: transparent;

  /* ── 面板/表面 ─────────────────────── */
  --wb-panel-strong: #ffffff;        /* 主面板背景 */
  --wb-panel-muted: #f7f8fb;         /* 次要面板 */
  --wb-panel-border: #e6ebf3;        /* 面板边框 */
  --wb-surface-blank: #ffffff;
  --wb-surface-overlay: rgba(255, 255, 255, 0.72);
  --wb-surface-overlay-strong: rgba(255, 255, 255, 0.88);
  --wb-surface-shell-hover: rgba(255, 255, 255, 0.32);

  /* ── 输入框 ─────────────────────── */
  --wb-input-bg: #ffffff;
  --wb-input-border: #dfe5ef;

  /* ── 表格 ─────────────────────── */
  --wb-table-header-bg: #f7f8fb;
  --wb-table-row-hover-bg: rgba(var(--el-color-primary-rgb), 0.05);

  /* ── 标签/胶囊 ─────────────────────── */
  --wb-tag-bg: #edf2ff;
  --wb-tag-border: #dde6ff;
  --wb-tag-text: #5674e8;
  --wb-chip-muted-bg: rgba(255, 255, 255, 0.7);

  /* ── 状态色 ─────────────────────── */
  --wb-status-success-text: #2d8f62;
  --wb-status-success-border: #c9ecd8;
  --wb-status-success-bg: #f2fbf6;
  --wb-status-neutral-text: #8793aa;
  --wb-status-neutral-border: #e2e7f0;
  --wb-status-neutral-bg: #f7f9fc;
  --wb-trend-up: #ef4444;     /* 红涨 */
  --wb-success: #22a772;      /* 绿跌 */

  /* ── 投影 ─────────────────────── */
  --wb-panel-shadow: 0 6px 18px rgba(31, 42, 68, 0.04);
  --wb-popover-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
  --wb-card-shadow: 0 8px 24px rgba(31, 42, 68, 0.05);
  --wb-card-shadow-hover: 0 12px 28px rgba(31, 42, 68, 0.07);

  /* ── 圆角 ─────────────────────── */
  --wb-radius-xl: 14px;
  --wb-radius-lg: 12px;
  --wb-radius-md: 10px;
  --wb-radius-sm: 8px;

  /* ── 布局尺寸 ─────────────────────── */
  --wb-topbar-height: 64px;
  --wb-sidebar-width: 192px;

  /* ── 侧边栏 ─────────────────────── */
  --wb-sidebar-item-active: #dfe8ff;
  --wb-sidebar-item-hover: #eef2f8;

  /* ── 主题强调色 ─────────────────────── */
  --wb-accent-soft: rgba(91, 126, 251, 0.1);
  --wb-accent-border: rgba(91, 126, 251, 0.34);
  --wb-accent-text: #4c70ef;
  --wb-on-primary: #ffffff;

  /* ── 顶栏控件 ─────────────────────── */
  --wb-shell-control-bg: rgba(255, 255, 255, 0.56);
  --wb-shell-control-hover-bg: rgba(255, 255, 255, 0.8);

  /* ── 分割线 ─────────────────────── */
  --wb-divider: #e8edf4;
}
```

## 页面布局框架

### 整体结构

```
┌──────────────────────────────────────────────────────────┐
│ Topbar (64px, 透明背景，水平导航)                            │
│ [Logo·品牌] [首页][推广][创编][素材][资产][归因][报表][分析][设置] │
├────────┬─────────────────────────────────────────────────┤
│Sidebar │ TagsView (带底部毛玻璃效果)                        │
│(192px) ├─────────────────────────────────────────────────┤
│可折叠    │ Main Content (el-scrollbar)                      │
│到56px   │ (页面内容区，各种 wb-soft-panel)                   │
└────────┴─────────────────────────────────────────────────┘
```

### WorkbenchLayout 关键样式

```vue
<style scoped>
.workbench-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--wb-page-bg);     /* 渐变页面背景 */
}

.workbench-layout__body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.workbench-layout__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 0 16px 0 0;  /* 右侧留空，左侧紧贴sidebar */
}

/* 标签栏毛玻璃效果 */
.workbench-layout__glass-bar {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

html.dark .workbench-layout__glass-bar {
  background-color: rgba(35, 36, 37, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.workbench-layout__content {
  flex: 1;
  min-height: 0;
  /* 不使用 overflow: auto，由 el-scrollbar 组件管理滚动 */
}
</style>
```

## 面板样式

### wb-soft-panel（主面板）

最核心的面板样式，用于筛选区、报表区、趋势区等所有内容容器：

```css
.wb-soft-panel {
  background: var(--wb-panel-strong);   /* 白色 */
  border: none;                         /* 无边框！区别于传统规范 */
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);  /* 微投影 */
}
```

### wb-glass-panel（毛玻璃面板）

用于侧边栏、标签栏等需要透明效果的区域：

```css
.wb-glass-panel {
  background: transparent;
  border: 0;
  box-shadow: none;
  backdrop-filter: none;
}
```

### 使用示例

```vue
<section class="workbench-filter wb-soft-panel">
  <!-- 筛选区内容 -->
</section>

<section class="workbench-report wb-soft-panel">
  <!-- 报表区内容 -->
</section>
```

### 页面内容区对齐规则

> **关键设计约束**：页面内容区的左边缘必须与标签栏（TagsView）的左边缘对齐，左侧padding为0。

```vue
<!-- ✅ 正确：左padding 0，紧贴标签栏左边缘 -->
<div style="padding: 16px 16px 16px 0;">

<!-- ❌ 错误：左padding 20px，内容与标签栏不对齐 -->
<div style="padding: 16px 20px;">
```

### 颜色使用禁忌

**禁止使用Tailwind硬编码颜色**（如 `text-gray-500`、`bg-white`、`bg-green-50`），必须使用CSS变量：

| ❌ 禁止                              | ✅ 正确                                         |
| ------------------------------------ | ----------------------------------------------- |
| `class="text-gray-500"`             | `style="color: var(--el-text-color-secondary)"` |
| `class="text-gray-800"`             | `style="color: var(--el-text-color-primary)"`   |
| `class="text-gray-400"`             | `style="color: var(--el-text-color-placeholder)"` |
| `class="bg-white"`                  | `style="background: var(--el-bg-color)"`        |
| `class="bg-green-50 text-green-600"` | 自定义CSS类 + CSS变量（支持暗黑）              |
| `rgba(20, 184, 166, 0.15)`（硬编码主题色） | `rgba(var(--el-color-primary-rgb), 0.12)` |

> Tailwind的 `flex`、`gap-*`、`p-*`、`truncate` 等**布局/间距工具类可以正常使用**，只有**颜色类**必须用CSS变量替代。

## 组件样式覆盖

### 按钮

```css
.el-button {
  border-radius: 10px;  /* 按钮圆角10px，柔和圆润 */
  height: 32px;
  padding: 0 14px;
  border-color: var(--el-border-color-light);
}

.el-button--primary {
  border-color: transparent;
  box-shadow: none;
}

.el-button.is-plain,
.el-button:not(.el-button--primary) {
  background: var(--wb-surface-blank);
}
```

### 输入框/选择器

```css
.el-input__wrapper,
.el-select__wrapper,
.el-textarea__inner,
.el-date-editor.el-input__wrapper {
  border-radius: 10px !important;   /* 输入框圆角10px */
  background: var(--wb-input-bg) !important;
  box-shadow: 0 0 0 1px var(--wb-input-border) inset !important;
}

.el-input__wrapper.is-focus,
.el-select__wrapper.is-focused {
  box-shadow:
    0 0 0 1px rgba(var(--el-color-primary-rgb), 0.42) inset,
    0 0 0 3px rgba(var(--el-color-primary-rgb), 0.08) !important;
}
```

### 弹出层

```css
.el-popper {
  border-radius: var(--wb-radius-lg) !important;
  border-color: var(--wb-panel-border) !important;
  box-shadow: var(--wb-popover-shadow) !important;
}
```

### 表格

```css
.el-table {
  --el-table-border-color: transparent;
  --el-table-header-bg-color: var(--wb-table-header-bg);
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: var(--wb-table-row-hover-bg);
  --el-table-header-text-color: var(--el-text-color-secondary);
  font-size: 12px;
  border: none;
}

/* 隐藏表格边框线 */
.el-table::before,
.el-table::after { display: none; }

.el-table td.el-table__cell,
.el-table th.el-table__cell { border-right: none; }

.el-table td.el-table__cell {
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.el-table th.el-table__cell { font-weight: 600; }
```

#### 报表表格样式增强

```css
/* 表头圆角 */
.workbench-report :deep(.el-table__header-wrapper) {
  border-radius: 6px 6px 0 0;
  overflow: hidden;
}

/* 隐藏边框补丁 */
.workbench-report :deep(.el-table__border-left-patch),
.workbench-report :deep(.el-table__border-right-patch),
.workbench-report :deep(.el-table__border-bottom-patch) {
  display: none;
}

/* 行间距 */
.workbench-report :deep(.el-table td.el-table__cell),
.workbench-report :deep(.el-table th.el-table__cell) {
  padding: 14px 0;
}

/* 状态Tag胶囊样式 */
.workbench-report :deep(.el-tag) {
  border-radius: 999px;
}

.workbench-report :deep(.el-tag.el-tag--success) {
  color: var(--wb-status-success-text);
  border-color: var(--wb-status-success-border);
  background: var(--wb-status-success-bg);
}
```

#### 固定列背景修复

表格有固定列（`fixed`）时，必须为固定列设置不透明背景，否则横向滚动时会透出下层列数据：

```css
/* 固定列td必须用不透明背景 */
.el-table td.el-table__cell.el-table-fixed-column--left,
.el-table td.el-table__cell.el-table-fixed-column--right {
  background: var(--el-bg-color) !important;
}

/* 固定列表头也需要不透明背景 */
.el-table th.el-table__cell.el-table-fixed-column--left,
.el-table th.el-table__cell.el-table-fixed-column--right {
  background: var(--wb-table-header-bg) !important;
}

/* hover行的固定列背景 */
.el-table__body tr:hover td.el-table__cell.el-table-fixed-column--left,
.el-table__body tr:hover td.el-table__cell.el-table-fixed-column--right {
  background: var(--wb-table-row-hover-bg) !important;
}
```

### 分页

```css
.el-pagination {
  --el-pagination-button-bg-color: var(--wb-surface-overlay-strong);
  --el-pagination-hover-color: var(--el-color-primary);
}
```

## 顶部导航栏规范

### 结构

```vue
<header class="workbench-topbar wb-glass-panel">
  <div class="workbench-topbar__left">
    <!-- 品牌区：Logo + 标题 -->
    <div class="workbench-topbar__brand">
      <InsightAdsLogo :size="24" />
      <div class="workbench-topbar__brand-title">天机 · 投放平台</div>
    </div>

    <!-- 导航tabs -->
    <nav class="workbench-topbar__nav">
      <button
        v-for="item in navItems"
        class="workbench-topbar__nav-item"
        :class="{ 'is-active': activeKey === item.key }"
        @click="emit('select', item.key)"
      >{{ item.label }}</button>
    </nav>
  </div>

  <div class="workbench-topbar__actions">
    <!-- 图标按钮组 -->
    <button class="workbench-topbar__icon-btn">...</button>
    <!-- 用户信息触发器 -->
  </div>
</header>
```

### 导航项样式要点

```css
.workbench-topbar__nav-item {
  height: var(--wb-topbar-height);  /* 与顶栏同高 */
  padding: 0 17px;
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
}

/* 激活态底部指示条 */
.workbench-topbar__nav-item.is-active::after {
  content: '';
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%) scaleX(1);
  width: 20px;
  height: 3px;
  border-radius: 3px;
  background: var(--el-color-primary);
}
```

### 图标按钮

```css
.workbench-topbar__icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  color: var(--el-text-color-secondary);
}

.workbench-topbar__icon-btn:hover {
  background: var(--wb-shell-control-hover-bg);
  color: var(--el-text-color-primary);
}
```

## 侧边栏规范

### 二级菜单结构

侧边栏采用**一级分组 + 二级菜单**的展开/折叠模式：

```vue
<aside class="workbench-sidebar wb-glass-panel" :class="{ 'is-collapsed': collapsed }">
  <el-scrollbar class="workbench-sidebar__scroll">
    <div v-for="section in sections" class="workbench-sidebar__section">
      <!-- 一级：图标 + 标题 + 展开箭头 -->
      <button class="workbench-sidebar__group-title"
              :class="{ 'has-active': sectionContainsActive(section) }">
        <el-icon><component :is="section.icon" /></el-icon>
        <span>{{ section.title }}</span>
        <el-icon class="workbench-sidebar__group-arrow"
                 :class="{ 'is-expanded': isSectionExpanded(section.key) }">
          <ArrowRight />
        </el-icon>
      </button>

      <!-- 二级菜单列表 -->
      <div v-show="isSectionExpanded(section.key)" class="workbench-sidebar__list">
        <button v-for="item in section.items"
                class="workbench-sidebar__item"
                :class="{ 'is-active': activeItem === item.key, 'is-disabled': item.disabled }">
          {{ item.label }}
        </button>
      </div>
    </div>
  </el-scrollbar>

  <!-- 底部折叠按钮 -->
  <div class="workbench-sidebar__toggle">
    <button class="workbench-sidebar__toggle-btn">
      <el-icon><Fold v-if="!collapsed" /><Expand v-else /></el-icon>
    </button>
  </div>
</aside>
```

### 关键样式

```css
/* 一级菜单 */
.workbench-sidebar__group-title {
  min-height: 38px;
  padding: 0 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
}

.workbench-sidebar__group-title.has-active {
  color: var(--el-color-primary);
}

/* 二级菜单 */
.workbench-sidebar__item {
  min-height: 34px;
  padding: 0 12px 0 34px;  /* 左侧缩进 */
  border-radius: 8px;
  font-size: 13px;
}

.workbench-sidebar__item.is-active {
  background: var(--wb-sidebar-item-active);
  color: var(--el-color-primary);
  font-weight: 600;
}

.workbench-sidebar__item.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
```

## 筛选区规范

### Workbench筛选区结构

```vue
<section class="workbench-filter wb-soft-panel">
  <!-- 头部：标题 + 转化口径/时间维度/日期选择 -->
  <div class="workbench-filter__header">
    <div class="workbench-filter__title">广告</div>
    <div class="workbench-filter__header-actions">
      <el-select v-model="conversionRule" class="workbench-filter__field--rule" />
      <el-select v-model="timeGranularity" class="workbench-filter__field--granularity" />
      <el-date-picker type="daterange" class="workbench-filter__field--date" />
      <el-button>数据对比</el-button>
    </div>
  </div>

  <!-- 已选条件Pill -->
  <div class="workbench-filter__selected">
    <span class="workbench-filter__selected-icon"><el-icon><Search /></el-icon></span>
    <span class="workbench-filter__selected-pill">已选账户 · 20项</span>
    <span class="workbench-filter__selected-pill is-secondary">媒体: 腾讯广告</span>
  </div>

  <!-- 筛选表单行 -->
  <el-form class="workbench-filter__form">
    <div class="workbench-filter__row">
      <el-select multiple collapse-tags placeholder="产品" class="workbench-filter__field--product" />
      <el-select multiple collapse-tags placeholder="应用" class="workbench-filter__field--app" />
      <el-input v-model="keyword" class="workbench-filter__field--search-input">
        <template #prepend>
          <el-select style="width: 100px">...</el-select>
        </template>
      </el-input>
      <div class="workbench-filter__actions">
        <el-button type="primary" :icon="Search">查询</el-button>
        <el-button :icon="RefreshRight">重置</el-button>
      </div>
    </div>
  </el-form>
</section>
```

### Pill标签样式

```css
.workbench-filter__selected-pill {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;           /* 全圆角胶囊 */
  background: var(--wb-tag-bg);
  border: 1px solid var(--wb-tag-border);
  color: var(--wb-tag-text);
  font-size: 12px;
  font-weight: 600;
}

/* 次要Pill */
.workbench-filter__selected-pill.is-secondary {
  background: var(--wb-chip-muted-bg);
  border-color: var(--wb-chip-muted-border);
  color: var(--el-text-color-secondary);
}
```

### 筛选字段宽度参考

| 字段类型  | 宽度  |
| --------- | ----- |
| 转化口径  | 148px |
| 时间维度  | 124px |
| 日期范围  | 260px |
| 产品下拉  | 168px |
| 应用/媒体 | 180px |
| 搜索输入  | 280px |

## 数据趋势区规范

### Summary卡片

```vue
<div class="workbench-trend__summary-card">
  <div class="workbench-trend__summary-label">曝光次数</div>
  <div class="workbench-trend__summary-value">1,234,567</div>
</div>
```

```css
.workbench-trend__summary-card {
  min-width: 242px;
  padding: 12px 18px;
  border: 1px solid var(--wb-accent-border);
  border-radius: var(--wb-radius-md);        /* 10px */
  background: var(--wb-summary-card-bg);     /* 渐变白 */
  box-shadow: inset 0 0 0 1px var(--wb-summary-card-stroke);
}

.workbench-trend__summary-value {
  margin-top: 4px;
  font-size: 30px;
  line-height: 1;
  font-weight: 700;
  font-variant-numeric: tabular-nums;        /* 等宽数字 */
}
```

### 指标卡片

```vue
<article class="workbench-metrics__card wb-soft-panel">
  <div class="workbench-metrics__title">花费</div>
  <div class="workbench-metrics__value">¥12,345.67</div>
  <div class="workbench-metrics__footer">
    <span>较昨日</span>
    <span class="workbench-metrics__trend is-up">+12.5%</span>
  </div>
</article>
```

```css
.workbench-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.workbench-metrics__card {
  padding: 16px;
  border-radius: var(--wb-radius-sm);        /* 8px */
}

.workbench-metrics__value {
  margin-top: 10px;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

/* 红涨绿跌 */
.workbench-metrics__trend.is-up { color: var(--wb-trend-up); }
.workbench-metrics__trend.is-down { color: var(--wb-success); }
```

## 图表规范

### 图表主题composable

使用 `useChartTheme` 自动跟随主题色变化：

```typescript
import { useChartTheme } from '@/composables/useChartTheme'

const chartTheme = useChartTheme()

// chartTheme.value 包含：
// primary: 当前主题色（RGB格式）
// primaryAreaStart: rgba(主色, 0.3)  — 面积图渐变起始
// primaryAreaEnd: rgba(主色, 0.05)   — 面积图渐变结束
// comparison: 'rgb(156, 163, 175)'   — 对比线色
// palette: [主色, indigo, orange, pink, gray]
// axisLabelColor / axisLineColor / splitLineColor
// legendColor / titleColor
// tooltipBg / tooltipBorder / tooltipText
```

### 标准折线图配置

```typescript
const chartOption = computed<EChartsOption>(() => ({
  legend: {
    top: 2,
    right: 0,
    textStyle: { color: chartTheme.value.legendColor },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLabel: { color: chartTheme.value.axisLabelColor },
    axisLine: { lineStyle: { color: chartTheme.value.axisLineColor } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: chartTheme.value.axisLabelColor },
    splitLine: { lineStyle: { color: chartTheme.value.splitLineColor } },
  },
  series: [
    {
      name: '本周期',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      itemStyle: { color: chartTheme.value.primary },
      lineStyle: { width: 3 },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: chartTheme.value.primaryAreaStart },
            { offset: 1, color: chartTheme.value.primaryAreaEnd },
          ],
        },
      },
    },
    {
      name: '上周期',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, type: 'dashed', color: chartTheme.value.comparison },
    },
  ],
}))
```

## 主题切换机制

### 原理

使用 `useWorkbenchTheme` composable管理17种主题色（shadcn/tailwind全部彩色），
通过JS动态设置 `document.documentElement.style` 的CSS变量实现实时切换。

### 使用方式

```typescript
import { useWorkbenchTheme, applyWorkbenchTheme } from '@/composables/useWorkbenchTheme'

const {
  themePresets,      // 17种预设列表
  selectedTheme,     // 当前选中主题（computed）
  selectedThemeKey,  // 当前key（ref, localStorage持久化）
  setTheme,          // (key: string) => void
  isDark,            // 暗黑模式（ref, localStorage持久化）
  toggleDark,        // () => void
} = useWorkbenchTheme()

// 监听变化自动应用
watch([selectedTheme, isDark], ([theme, dark]) => {
  applyWorkbenchTheme(theme, dark)
}, { immediate: true })
```

### 17种可选主题色

| 主题    | 色值(500) | 说明           |
| ------- | --------- | -------------- |
| red     | #ef4444   | 热烈红色       |
| orange  | #f97316   | 活力橙色       |
| amber   | #f59e0b   | 琥珀暖黄       |
| yellow  | #eab308   | 明亮黄色       |
| lime    | #84cc16   | 青柠绿色       |
| green   | #22c55e   | 翠绿色         |
| emerald | #10b981   | 祖母绿         |
| teal    | #14b8a6   | 青绿色         |
| cyan    | #06b6d4   | 青蓝色         |
| sky     | #0ea5e9   | 天空蓝         |
| blue    | #3b82f6   | 经典蓝（默认） |
| indigo  | #6366f1   | 靛青色         |
| violet  | #8b5cf6   | 紫罗兰         |
| purple  | #a855f7   | 纯紫色         |
| fuchsia | #d946ef   | 品红紫         |
| pink    | #ec4899   | 粉红色         |
| rose    | #f43f5e   | 玫瑰红         |

## 暗黑模式

### 暗色变量管理机制

> ⚠️ 暗黑模式的CSS变量通过**两层机制**管理：
> 1. **CSS层（`workbench-theme.css` 的 `html.dark`）**：作为兜底fallback，防止JS执行延迟时产生FOUC闪屏
> 2. **JS层（`useWorkbenchTheme` composable）**：运行时动态注入，会覆盖CSS层的值，确保主题色跟随用户选择

### 暗色Token（所有主题共享）

以下变量在 `workbench-theme.css` 的 `html.dark` 块中作为CSS兜底定义，
同时也在 `useWorkbenchTheme.ts` 的 `wbDarkBaseVars` 和 `elDarkVars` 中由JS动态注入：

```css
html.dark {
  color-scheme: dark;

  /* Element Plus 暗色基础 */
  --el-bg-color: #1d1e1f;
  --el-bg-color-page: #141414;
  --el-bg-color-overlay: #1d1e1f;
  --el-text-color-primary: #e5eaf3;
  --el-text-color-regular: #cfd3dc;
  --el-text-color-secondary: #a3a6ad;
  --el-text-color-placeholder: #8d9095;
  --el-border-color: #4c4d4f;
  --el-border-color-light: #414243;
  --el-border-color-lighter: #363637;
  --el-fill-color: #303030;
  --el-fill-color-light: #262727;
  --el-fill-color-blank: #232324;

  /* Workbench 暗色基础 */
  --wb-panel-strong: #232425;
  --wb-panel-muted: #1a1b1c;
  --wb-panel-border: #363637;
  --wb-surface-blank: #232425;
  --wb-input-bg: #232425;
  --wb-input-border: #4c4d4f;
  --wb-table-header-bg: #1a1b1c;
  --wb-status-success-text: #4ade80;
  --wb-status-success-bg: #0f2218;
  --wb-panel-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  --wb-popover-shadow: 0 12px 32px rgba(0, 0, 0, 0.32);
  --wb-card-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  --wb-card-shadow-hover: 0 12px 28px rgba(0, 0, 0, 0.28);
  --wb-divider: #363637;
  --wb-success: #4ade80;
  --wb-warning: #fbbf24;
}
```

### 暗黑页面背景

暗色模式下页面背景也有径向晕染，但透明度大幅降低。
此变量由 `useWorkbenchTheme` 根据当前主题色**JS动态生成**，无法在CSS中静态定义：

```css
/* 由 useWorkbenchTheme 动态生成，r/g/b 为当前主题色RGB分量 */
--wb-page-bg: radial-gradient(circle at top right, rgba(r, g, b, 0.06), transparent 32%),
              linear-gradient(180deg, #141618 0%, #111214 48%, #0f1012 100%);
```

## 页面模式

### 模式1：推广页（Tab + 筛选 + 表格）

已存在的推广-腾讯广告页面，采用传统组件嵌入Workbench面板的方式：

```vue
<div class="promotion-tencent-page">
  <!-- 筛选壳 -->
  <section class="promotion-tencent-page__search-shell">
    <div class="promotion-tencent-page__tabs-shell">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="媒体账户" name="account" />
        <el-tab-pane label="项目" name="project" />
        <el-tab-pane label="广告" name="ad" />
      </el-tabs>
    </div>
    <FilterSection class="promotion-tencent-page__filter" />
  </section>

  <!-- 表格壳 -->
  <section class="promotion-tencent-page__table-shell">
    <TableSection class="promotion-tencent-page__table" />
  </section>
</div>
```

关键：嵌入旧组件时，需要在page级别覆盖组件的圆角和背景为Workbench风格：

```css
/* 外壳使用wb样式 */
.promotion-tencent-page__search-shell {
  background: var(--wb-panel-strong);
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* 内部组件去除自身背景和边框 */
:deep(.promotion-tencent-page__filter) {
  background: transparent;
}

:deep(.promotion-tencent-page__table) {
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
}

/* 恢复内部控件为标准方角（因为外壳已经是圆角） */
:deep(.promotion-tencent-page__filter .el-input__wrapper) {
  border-radius: var(--el-border-radius-base) !important;
  box-shadow: 0 0 0 1px var(--el-border-color) inset !important;
}
```

### 模式2：Workbench原生报表页

完全使用Workbench风格的组件，无需样式覆盖：

```vue
<div class="tencent-workbench-page">
  <section class="tencent-workbench-page__canvas">
    <WorkbenchFilterBar />
    <WorkbenchTrendSection />
    <WorkbenchReportTable />
  </section>
</div>

<style scoped>
.tencent-workbench-page__canvas {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
```

### 模式3：占位页

功能筹备中的模块使用统一占位页：

```vue
<el-empty description="该模块正在开发中..." />
```

## 趋势颜色规范（红涨绿跌）

> ⚠️ 与传统 `junelce-design-system` 一致，全系统使用中国股市惯例。

| 趋势      | 颜色变量        | 值             |
| --------- | --------------- | -------------- |
| 正数/上涨 | `--wb-trend-up` | `#ef4444` (红) |
| 负数/下跌 | `--wb-success`  | `#22a772` (绿) |

## 字体规范

### 字体栈配置

通过 `--el-font-family` CSS变量统一管理，确保Element Plus组件和自定义组件使用同一字体栈：

```css
:root {
  /* 字体栈 = 系统字体 + Windows西文 + 中文 + 西文兜底 + Emoji */
  --el-font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei",
    "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Noto Color Emoji";
}

html, body {
  font-family: var(--el-font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 全局等宽数字（表格/指标卡/数据区必备）

```css
.el-table,
.el-table__body,
.el-table .cell,
.el-descriptions__content,
.stat-number,
.amount,
.percent,
.workbench-metrics__value,
.workbench-trend__summary-value {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

### 代码/等宽字体

```css
code, pre, .code {
  font-family:
    "SF Mono", SFMono-Regular, Consolas,
    "Liberation Mono", Menlo, Monaco, monospace;
}
```

## BEM命名约定

Workbench组件使用BEM命名：

```
.workbench-{组件名}                    /* Block */
.workbench-{组件名}__{元素名}           /* Element */
.workbench-{组件名}__{元素名}--{修饰符}  /* Modifier */
```

独立状态类使用 `is-` 前缀：

```css
.is-active    /* 激活态 */
.is-disabled  /* 禁用态 */
.is-collapsed /* 折叠态 */
.is-expanded  /* 展开态 */
.is-up        /* 上涨 */
.is-down      /* 下跌 */
```

## 滚动条规范

### 禁止使用浏览器原生滚动条

> ⚠️ 全局规则：**所有可滚动区域必须使用 `<el-scrollbar>` 组件**，禁止使用 `overflow: auto/scroll` 产生浏览器原生滚动条。

### 使用方式

```vue
<!-- ✅ 正确：使用 el-scrollbar -->
<el-scrollbar class="content-area">
  <div>可滚动内容...</div>
</el-scrollbar>

<!-- ❌ 错误：使用 overflow: auto 产生原生滚动条 -->
<div style="overflow: auto;">
  <div>可滚动内容...</div>
</div>
```

### 典型场景

| 场景            | 实现方式                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| 主内容区        | `WorkbenchLayout` 中 `<el-scrollbar class="workbench-layout__content">`  |
| 侧边栏菜单      | `WorkbenchSidebar` 中 `<el-scrollbar class="workbench-sidebar__scroll">` |
| 弹窗/抽屉内列表 | `<el-scrollbar max-height="480px">` 限制最大高度                         |
| 树形面板        | `<el-scrollbar class="flex-1">` 撑满剩余空间                             |

### 注意事项

1. `overflow: hidden` 用于**布局裁切**时仍可使用，它不产生滚动条
2. `el-scrollbar` 需要**明确的高度约束**（flex:1 / max-height / 固定高度）才能正常工作
3. 嵌套 `el-scrollbar` 时需确保父级有高度约束，避免高度塌陷

---

## 弹窗规范

### footer按钮间距

```css
.el-dialog__footer .el-button + .el-button {
  margin-left: 12px;
}
```

### 弹窗按钮布局

```vue
<template #footer>
  <div class="flex justify-end" style="gap: 12px;">
    <el-button @click="handleClose">取消</el-button>
    <el-button type="primary" @click="handleConfirm">确定</el-button>
  </div>
</template>
```

### 弹窗内输入框圆角

弹窗/抽屉内的输入框使用**6px圆角**，区别于全局的10px圆角，避免在弹窗小空间内显得过圆：

```css
/* 弹窗/抽屉内输入框圆角 6px */
.el-dialog .el-input__wrapper,
.el-drawer .el-input__wrapper,
.el-dialog .el-select__wrapper,
.el-drawer .el-select__wrapper,
.el-dialog .el-textarea__inner,
.el-drawer .el-textarea__inner {
  border-radius: 6px !important;
}
```

### 弹窗/抽屉内按钮圆角

弹窗和抽屉内的按钮也使用基础圆角，与弹窗内输入框保持一致：

```css
.el-dialog .el-button,
.el-drawer .el-button {
  border-radius: var(--el-border-radius-base) !important;
}
```

### Tooltip样式覆盖

深色背景的Tooltip使用独立的暗色样式，区别于普通浅色Popover：

```css
/* 深色Tooltip */
.el-popper.is-dark {
  background: #1f2937 !important;
  border-color: #1f2937 !important;
  color: #e5eaf3 !important;
  border-radius: var(--wb-radius-sm) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16) !important;
  font-size: 12px;
  line-height: 1.6;
}

.el-popper.is-dark .el-popper__arrow::before {
  background: #1f2937 !important;
  border-color: #1f2937 !important;
}

/* 暗黑模式下的Tooltip */
html.dark .el-popper.is-dark {
  background: #363637 !important;
  border-color: #4c4d4f !important;
}
```
