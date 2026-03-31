# 组件详细规范

> Workbench风格的基础组件详细规范。全局圆角10px（弹窗内6px）。

## 按钮规范

### 尺寸

| 尺寸 | 高度 | 用途 |
|------|------|------|
| default | 32px | 表单按钮、操作按钮 |
| small | 28px | 表格内操作、紧凑区域 |

### 圆角

| 场景 | 圆角 |
|------|------|
| 页面全局 | 10px |
| 弹窗/抽屉内 | `var(--el-border-radius-base)` |

### 类型使用场景

| 类型 | 场景 |
|------|------|
| `type="primary"` | 主操作：查询、提交、确认、添加 |
| 默认（无type） | 次要操作：重置、取消 |
| `type="danger"` | 危险操作：删除 |
| `link type="primary"` | 表格内操作：编辑、查看 |
| `link type="danger"` | 表格内删除 |

### 按钮间距

| 场景 | 间距 |
|------|------|
| 弹窗footer | `gap: 12px` |
| 工具栏按钮组 | `gap: 12px` |
| 表格操作列 | `gap: 8px` |

### 按钮样式覆盖

```css
.el-button {
  border-radius: 10px;
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

### 按钮组（ButtonGroup）+ Popover + Tooltip

> 当按钮需要同时支持Popover和Tooltip时，需要特殊处理避免按钮组圆角被破坏。

```vue
<el-button-group>
  <el-button type="primary">查询</el-button>

  <el-popover v-model:visible="popoverVisible" trigger="click" placement="bottom-start">
    <template #reference>
      <span class="inline-flex">
        <el-tooltip content="查询条件展示" placement="top" :disabled="popoverVisible">
          <el-button :icon="Setting" />
        </el-tooltip>
      </span>
    </template>
    <div>Popover内容...</div>
  </el-popover>
</el-button-group>

<style scoped>
/* 修复wrapper元素导致的按钮组圆角问题 */
.search-action-bar :deep(.el-button-group) {
  display: inline-flex;
}
.search-action-bar :deep(.el-button-group .inline-flex .el-button) {
  border-radius: 0;
  margin-left: -1px;
}
.search-action-bar :deep(.el-button-group > *:last-child .el-button) {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
```

---

## 表单规范

### 表单布局

| 场景 | 布局方式 |
|------|---------|
| 筛选区 | `el-form :inline="true"` |
| 弹窗表单 | `el-form label-position="top"` + `el-row/el-col` |

### 输入框宽度参考

| 类型 | 推荐宽度 |
|------|---------|
| 转化口径 | 148px |
| 时间维度 | 124px |
| 日期范围 | 260px |
| 产品下拉 | 168px |
| 应用/媒体 | 180px |
| 搜索输入 | 280px |

### 输入框样式覆盖

```css
/* 全局：10px圆角 */
.el-input__wrapper,
.el-select__wrapper,
.el-textarea__inner {
  border-radius: 10px !important;
  background: var(--wb-input-bg) !important;
  box-shadow: 0 0 0 1px var(--wb-input-border) inset !important;
}

/* 聚焦：双层box-shadow */
.el-input__wrapper.is-focus,
.el-select__wrapper.is-focused {
  box-shadow:
    0 0 0 1px rgba(var(--el-color-primary-rgb), 0.42) inset,
    0 0 0 3px rgba(var(--el-color-primary-rgb), 0.08) !important;
}
```

### 表单验证

```typescript
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { max: 20, message: '最大支持20个字符', trigger: 'blur' }
  ]
})
```

### 表单验证动画（抖动）

```vue
<script setup>
const shakingField = ref<string | null>(null)

const triggerShake = (field: string) => {
  shakingField.value = field
  setTimeout(() => { shakingField.value = null }, 400)
}
</script>

<template>
<el-form-item :class="{ 'is-shaking': shakingField === 'account' }">
  <el-input v-model="form.account" />
</el-form-item>
</template>

<style>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
.el-form-item.is-shaking {
  animation: shake 0.4s ease-out;
}
</style>
```

---

## 表格规范

### 全局样式

```css
.el-table {
  --el-table-border-color: transparent;
  --el-table-header-bg-color: var(--wb-table-header-bg);
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: var(--wb-table-row-hover-bg);
  --el-table-current-row-bg-color: var(--wb-table-current-row-bg);
  --el-table-header-text-color: var(--el-text-color-secondary);
  font-size: 12px;
  border: none;
}
```

### 行高规范

| 场景 | 行高 |
|------|------|
| 基础表格 | 48px |
| 带ID+名称列 | 56px |

### 列宽规范

| 列类型 | 宽度 |
|--------|------|
| 选择列 | 50px |
| ID列 | 80px |
| 名称列 | min-width: 120px |
| 状态列 | min-width: 90px |
| 操作列 | 120-150px, fixed="right" |

### 报表表格增强

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
```

### 固定列背景修复

```css
.el-table td.el-table__cell.el-table-fixed-column--left,
.el-table td.el-table__cell.el-table-fixed-column--right {
  background: var(--el-bg-color) !important;
}

.el-table th.el-table__cell.el-table-fixed-column--left,
.el-table th.el-table__cell.el-table-fixed-column--right {
  background: var(--wb-table-header-bg) !important;
}

.el-table__body tr:hover td.el-table__cell.el-table-fixed-column--left,
.el-table__body tr:hover td.el-table__cell.el-table-fixed-column--right {
  background: var(--wb-table-row-hover-bg) !important;
}
```

### 等宽数字

```css
.el-table, .el-table .cell {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

### 同比环比列样式

```vue
<!-- 红涨绿跌，使用CSS变量 -->
<span :style="{ color: value >= 0 ? 'var(--wb-trend-up)' : 'var(--wb-success)' }">
  {{ value >= 0 ? '+' : '' }}{{ value }}%
</span>
```

---

## Tag规范

### 状态Tag（胶囊样式）

```vue
<el-tag :type="getStatusTagType(status)" size="small" effect="light" round>
  {{ status }}
</el-tag>
```

Workbench样式覆盖：

```css
.workbench-report :deep(.el-tag) {
  border-radius: 999px; /* 胶囊 */
}

.workbench-report :deep(.el-tag.el-tag--success) {
  color: var(--wb-status-success-text);
  border-color: var(--wb-status-success-border);
  background: var(--wb-status-success-bg);
}
```

### 多标签展示

```vue
<el-tooltip v-if="roles.length > 2" :content="roles.join('、')" placement="top">
  <div class="flex flex-wrap gap-1">
    <el-tag v-for="role in roles.slice(0, 2)" size="small" type="primary" effect="light">
      {{ role }}
    </el-tag>
    <el-tag size="small" type="primary" effect="light">+{{ roles.length - 2 }}</el-tag>
  </div>
</el-tooltip>
```

---

## 下拉菜单规范

### 批量操作

```vue
<el-dropdown trigger="click" @command="handleBatchCommand">
  <el-button>
    批量操作<el-icon class="el-icon--right"><ArrowDown /></el-icon>
  </el-button>
  <template #dropdown>
    <el-dropdown-menu>
      <el-dropdown-item command="action1">操作1</el-dropdown-item>
      <el-dropdown-item command="action2">操作2</el-dropdown-item>
    </el-dropdown-menu>
  </template>
</el-dropdown>
```

---

## 分页规范

```vue
<el-pagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="total"
  :page-sizes="[10, 20, 50, 100]"
  layout="total, sizes, prev, pager, next, jumper"
  background
/>
```

样式覆盖：

```css
.el-pagination {
  --el-pagination-button-bg-color: var(--wb-surface-overlay-strong);
  --el-pagination-hover-color: var(--el-color-primary);
}
```

---

## Checkbox规范

### 全选+半选

```vue
<el-checkbox
  :model-value="isAllSelected"
  :indeterminate="isIndeterminate"
  @change="handleSelectAll"
>
  全选
</el-checkbox>
```

### checkbox-button主题色

```css
.el-checkbox-button.is-checked .el-checkbox-button__inner {
  background-color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary) !important;
  box-shadow: -1px 0 0 0 var(--el-color-primary) !important;
}
```

---

## Tree规范

### 树形面板

```vue
<el-tree
  ref="treeRef"
  :data="data"
  :props="{ label: 'label', children: 'children' }"
  node-key="id"
  :filter-node-method="filterNode"
  highlight-current
  @node-click="handleNodeClick"
/>

<style scoped>
:deep(.el-tree-node__content) {
  height: 32px;
}
/* 使用CSS变量适配主题色 */
:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(var(--el-color-primary-rgb), 0.1);
}
:deep(.el-tree-node.is-current > .el-tree-node__content .el-tree-node__label) {
  color: var(--el-color-primary);
}
</style>
```

---

## Radio-Button规范

```vue
<!-- 时间维度切换 -->
<el-radio-group v-model="timeDimension" size="default">
  <el-radio-button value="day">日</el-radio-button>
  <el-radio-button value="7days">7日</el-radio-button>
  <el-radio-button value="month">月</el-radio-button>
</el-radio-group>
```

---

## 多选下拉（隐藏箭头）

```vue
<el-select v-model="value" multiple filterable clearable class="hide-suffix">
  <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
</el-select>

<style scoped>
.hide-suffix :deep(.el-select__suffix) {
  display: none;
}
</style>
```

---

## 指标卡组件（MetricCard）

### 简洁版Props

```typescript
interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: number
  trendLabel?: string
}
```

### 增强版Props（推荐）

```typescript
interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: number           // 环比
  trendLabel?: string      // 环比标签
  extraTrend?: number      // 同比
  extraTrendLabel?: string // 同比标签
  tooltip?: string         // 指标释义Tooltip
  animate?: boolean        // 数值动画（vue3-count-to）
  duration?: number        // 动画时长，默认1200ms
}
```

### 样式

```css
.metric-card {
  padding: 16px;
  border-radius: var(--wb-radius-sm); /* 8px */
}

.metric-card__value {
  margin-top: 10px;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

/* 红涨绿跌 */
.metric-card__trend.is-up { color: var(--wb-trend-up); }
.metric-card__trend.is-down { color: var(--wb-success); }
```

### 带Tooltip的标题（虚线下划线）

```css
.metric-title-with-tooltip {
  border-bottom: 1px dashed var(--el-text-color-placeholder);
  cursor: help;
}
```

### 数值动画

```vue
<CountTo
  :startVal="0"
  :endVal="metricValue"
  :duration="1200"
  :decimals="2"
  separator=","
  :autoplay="true"
/>
```

### 布局

```css
.workbench-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}
```
