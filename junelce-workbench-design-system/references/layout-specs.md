# 布局详细规范

> Workbench风格的布局框架详细规范：Topbar、Sidebar、TagsView、主题配置。

## 框架尺寸总览

| 区域 | 尺寸 | CSS变量 |
|------|------|---------|
| Topbar高度 | 64px | `--wb-topbar-height` |
| Sidebar宽度 | 192px展开 / 56px折叠 | `--wb-sidebar-width` |
| 内容区padding | `0 16px 0 0`（左0右16） | — |
| 模块间距 | 16px | `gap: 16px` |
| 页面背景 | 渐变+径向晕染 | `--wb-page-bg` |

## Topbar规范

### 整体布局

```vue
<header class="workbench-topbar wb-glass-panel">
  <div class="workbench-topbar__left">
    <div class="workbench-topbar__brand">
      <InsightAdsLogo :size="24" />
      <div class="workbench-topbar__brand-title">天机 · 投放平台</div>
    </div>
    <nav class="workbench-topbar__nav">
      <button v-for="item in navItems"
              class="workbench-topbar__nav-item"
              :class="{ 'is-active': activeKey === item.key }"
              @click="emit('select', item.key)">
        {{ item.label }}
      </button>
    </nav>
  </div>
  <div class="workbench-topbar__actions">
    <!-- 图标按钮组 + 主题切换 + 用户信息 -->
  </div>
</header>
```

### 导航项样式

```css
.workbench-topbar__nav-item {
  height: var(--wb-topbar-height); /* 64px，与顶栏同高 */
  padding: 0 17px;
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  position: relative;
}

/* 激活态底部指示条 */
.workbench-topbar__nav-item.is-active::after {
  content: '';
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
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

### 右侧操作区

| 项目 | 值 |
|------|-----|
| 图标按钮间距 | `gap: 8px` |
| 图标大小 | 18-20px |
| Badge高度 | 18px / 字号12px / padding: 0 6px |

### 用户头像区域

```vue
<div class="workbench-topbar__user">
  <div class="workbench-topbar__avatar"
       style="background: var(--wb-user-avatar-bg);">
    <!-- 头像或图标 -->
  </div>
  <div class="workbench-topbar__user-info">
    <span class="workbench-topbar__user-name">用户名</span>
    <span class="workbench-topbar__user-role">角色名</span>
  </div>
</div>
```

---

## Sidebar规范

### 二级菜单结构

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

      <!-- 二级菜单 -->
      <div v-show="isSectionExpanded(section.key)" class="workbench-sidebar__list">
        <button v-for="item in section.items"
                class="workbench-sidebar__item"
                :class="{ 'is-active': activeItem === item.key,
                          'is-disabled': item.disabled }">
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

### 关键尺寸

| 项目 | 值 |
|------|-----|
| 一级菜单高度 | 38px |
| 一级菜单圆角 | 10px |
| 一级菜单字号 | 13px / font-weight: 600 |
| 二级菜单高度 | 34px |
| 二级菜单圆角 | 8px |
| 二级菜单字号 | 13px |
| 二级菜单左缩进 | 34px |

### 激活与状态样式

```css
/* 二级菜单激活 */
.workbench-sidebar__item.is-active {
  background: var(--wb-sidebar-item-active);
  color: var(--el-color-primary);
  font-weight: 600;
}

/* 一级分组含有激活项时变色 */
.workbench-sidebar__group-title.has-active {
  color: var(--el-color-primary);
}

/* 禁用菜单项 */
.workbench-sidebar__item.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
```

---

## TagsView规范（WorkbenchTagsView）

### 关键尺寸

| 项目 | 值 |
|------|-----|
| 标签高度 | 26px |
| 标签间距 | 8px |
| 标签圆角 | 6px |
| 标签字号 | 12px |
| 底部毛玻璃条 | `border-radius: 8px`，`background: rgba(255,255,255,0.4)` |

### 标签样式

```css
.workbench-tag {
  height: 26px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: transparent;
  cursor: pointer;
}

/* 激活标签 */
.workbench-tag.is-active {
  background: var(--wb-tag-bg);      /* #edf2ff */
  color: var(--wb-tag-text);          /* #5674e8 */
  border: 1px solid var(--wb-tag-border); /* #dde6ff */
  font-weight: 500;
}
```

### 右键菜单

| 功能 | 说明 |
|------|------|
| 重新刷新 | 刷新当前标签页内容（router.replace） |
| 关闭当前 | 关闭右键点击的标签 |
| 关闭其他 | 保留当前，关闭其他 |
| 关闭左侧 | 关闭左侧所有标签 |
| 关闭右侧 | 关闭右侧所有标签 |
| 关闭所有 | 关闭所有标签，跳转首页 |

```css
/* 右键菜单使用 wb 变量 */
.context-menu {
  background: var(--wb-context-menu-bg);       /* rgba(255,255,255,0.96) */
  backdrop-filter: var(--wb-context-menu-backdrop); /* blur(10px) */
  border-radius: var(--wb-radius-sm);
  box-shadow: var(--wb-popover-shadow);
}
```

---

## 主题切换机制

### 使用方式

```typescript
import { useWorkbenchTheme, applyWorkbenchTheme } from '@/composables/useWorkbenchTheme'

const {
  themePresets,      // 17种预设列表
  selectedTheme,     // 当前选中主题
  selectedThemeKey,  // 当前key（localStorage持久化）
  setTheme,          // (key: string) => void
  isDark,            // 暗黑模式
  toggleDark,        // () => void
} = useWorkbenchTheme()

watch([selectedTheme, isDark], ([theme, dark]) => {
  applyWorkbenchTheme(theme, dark)
}, { immediate: true })
```

### 17色预设

| 主题 | 色值(500) |
|------|----------|
| red | #ef4444 |
| orange | #f97316 |
| amber | #f59e0b |
| yellow | #eab308 |
| lime | #84cc16 |
| green | #22c55e |
| emerald | #10b981 |
| teal | #14b8a6 |
| cyan | #06b6d4 |
| sky | #0ea5e9 |
| blue | #3b82f6（默认） |
| indigo | #6366f1 |
| violet | #8b5cf6 |
| purple | #a855f7 |
| fuchsia | #d946ef |
| pink | #ec4899 |
| rose | #f43f5e |

### 切换原理

通过JS动态设置`document.documentElement.style`的CSS变量：
- `--el-color-primary` 及其 light/dark 衍生色
- `--wb-page-bg`（页面渐变背景，基于主题色生成晕染）
- `--wb-sidebar-item-active`、`--wb-tag-bg`等衍生变量

### WorkbenchThemeDrawer

抽屉宽度640px，包含：
- 17色色板（grid展示，点击切换）
- 暗黑模式开关
- 水印开关

---

## 暗黑模式

### 双层管理机制

1. **CSS层**（`workbench-theme.css`的`html.dark`）：作为兜底fallback
2. **JS层**（`useWorkbenchTheme` composable）：运行时动态注入，覆盖CSS层

### 暗色页面背景

由JS根据当前主题色动态生成（无法在CSS中静态定义）：

```css
/* r/g/b = 当前主题色RGB分量 */
--wb-page-bg: radial-gradient(circle at top right, rgba(r, g, b, 0.06), transparent 32%),
              linear-gradient(180deg, #141618 0%, #111214 48%, #0f1012 100%);
```

### 暗黑模式切换开关

```css
.theme-switch {
  --el-switch-on-color: var(--el-color-primary);
  --el-switch-off-color: #dcdfe6;
}
.theme-switch :deep(.el-switch__core) {
  border-radius: 10px;
  height: 22px;
  min-width: 44px;
}
.theme-switch :deep(.el-switch__core .el-switch__action) {
  width: 18px;
  height: 18px;
}
```

---

## 首页全屏模式

当路由为首页（如`/home-overview`）时，WorkbenchLayout自动隐藏Sidebar和TagsView，主内容区占满全屏：

```vue
<template>
  <WorkbenchTopbar />
  <div class="workbench-layout__body">
    <WorkbenchSidebar v-if="!isHomePage" />
    <div class="workbench-layout__main">
      <WorkbenchTagsView v-if="!isHomePage" />
      <el-scrollbar class="workbench-layout__content">
        <router-view />
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
const isHomePage = computed(() => route.path === '/home-overview')
</script>
```
