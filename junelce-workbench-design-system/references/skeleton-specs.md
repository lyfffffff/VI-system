# 骨架屏与加载状态规范

> 加载状态、骨架屏、数值动画、过渡效果的统一规范。

## 骨架屏（Skeleton）

### 使用原则

- 首屏加载、数据请求中使用骨架屏占位
- **必须添加`animated`属性**，禁止静态骨架
- 骨架形状应贴合最终内容形态

### 指标卡骨架

```vue
<template v-if="loading">
  <div class="workbench-metrics">
    <div v-for="i in 4" :key="i" class="wb-soft-panel" style="padding: 16px;">
      <el-skeleton :rows="2" animated />
    </div>
  </div>
</template>
<template v-else>
  <MetricCard v-for="item in metrics" :key="item.key" v-bind="item" />
</template>
```

### 表格骨架

```vue
<template v-if="loading">
  <div class="wb-soft-panel" style="padding: 16px;">
    <el-skeleton :rows="8" animated />
  </div>
</template>
<template v-else>
  <el-table :data="tableData" ... />
</template>
```

### 图表加载动画（7柱条跳动）

```vue
<template v-if="chartLoading">
  <div class="chart-loading">
    <div class="chart-loading__bars">
      <span v-for="i in 7" :key="i" class="chart-loading__bar"
            :style="{ animationDelay: `${i * 0.1}s` }" />
    </div>
    <div class="chart-loading__text">加载中...</div>
  </div>
</template>

<style>
.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 210px;
}

.chart-loading__bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 40px;
}

.chart-loading__bar {
  width: 4px;
  height: 20px;
  border-radius: 2px;
  background: var(--el-color-primary);
  opacity: 0.6;
  animation: bar-bounce 1.2s ease-in-out infinite;
}

@keyframes bar-bounce {
  0%, 100% { height: 20px; }
  50% { height: 40px; }
}

.chart-loading__text {
  margin-top: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
```

---

## 数值动画（vue3-count-to）

所有指标卡、Summary卡片的数值展示必须有过渡动画。

### 安装

```bash
npm install vue3-count-to
```

### 使用

```vue
<script setup>
import { CountTo } from 'vue3-count-to'
</script>

<template>
<CountTo
  :startVal="0"
  :endVal="metricValue"
  :duration="1200"
  :decimals="2"
  separator=","
  :autoplay="true"
/>
</template>
```

### 参数参考

| 参数 | 值 | 说明 |
|------|-----|------|
| duration | 1200 | 动画时长ms |
| decimals | 0-2 | 根据指标类型决定 |
| separator | "," | 千分位分隔 |
| autoplay | true | 自动开始 |

### 刷新时重新触发

数据更新时，通过改变key强制重新渲染：

```vue
<CountTo :key="countKey" :endVal="value" ... />

<!-- 数据更新时 -->
const countKey = ref(0)
const refreshData = () => {
  fetchData().then(() => { countKey.value++ })
}
```

---

## 页面过渡动画

### 路由过渡

```vue
<router-view v-slot="{ Component }">
  <Transition name="fade-slide" mode="out-in">
    <component :is="Component" />
  </Transition>
</router-view>

<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
```

### 列表hover效果

```css
.list-item {
  transition: all 0.2s ease;
}
.list-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--wb-card-shadow-hover);
}
```

### 卡片hover

```css
.wb-soft-panel {
  transition: box-shadow 0.2s ease;
}
.wb-soft-panel:hover {
  box-shadow: var(--wb-card-shadow-hover); /* 0 12px 28px rgba(31,42,68,0.07) */
}
```

---

## 水印规范

### 实现方式

使用Canvas生成水印图案，通过`background-image`平铺，覆盖全屏。

### 环境策略

| 环境 | 水印内容 | 行数 |
|------|---------|------|
| demo | "产品原型  仅供演示" + 用户信息 | 2行 |
| test | "测试环境" + 用户信息 | 2行 |
| production | 仅用户信息 | 1行 |

### 关键样式

```css
.watermark-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  user-select: none;
}
```

### Canvas参数

| 参数 | 值 |
|------|-----|
| 单元格尺寸 | 320×200px |
| 旋转角度 | -25° |
| 字号 | 14px |
| 亮色不透明度 | `rgba(0, 0, 0, 0.04)` |
| 暗色不透明度 | `rgba(255, 255, 255, 0.03)` |

### 暗黑模式适配

通过MutationObserver监听`html`元素的`class`变化，检测`dark`类名切换水印颜色：

```typescript
const observer = new MutationObserver(() => {
  const isDark = document.documentElement.classList.contains('dark')
  updateWatermark(isDark)
})

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
})
```

### 控制开关

水印可在WorkbenchThemeDrawer中切换显示/隐藏：

```vue
<!-- WorkbenchLayout.vue -->
<EnvBadge :show-watermark="showWatermark" />

<!-- WorkbenchThemeDrawer.vue -->
<div class="flex items-center justify-between">
  <span>水印</span>
  <el-switch v-model="showWatermark" @change="emit('toggle-watermark')" />
</div>
```

---

## 响应式断点规范

### 断点定义

| 断点 | 宽度 | 用途 |
|------|------|------|
| sm | ≥640px | 手机横屏 |
| md | ≥768px | 平板 |
| lg | ≥1024px | 小桌面 |
| xl | ≥1280px | 标准桌面 |
| 2xl | ≥1536px | 大屏 |

### 指标卡网格响应

```vue
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-[14px]">
  <MetricCard v-for="item in metrics" :key="item.key" v-bind="item" />
</div>
```

### 弹窗宽度响应

```vue
<el-dialog :width="dialogWidth">
  ...
</el-dialog>

<script setup>
const dialogWidth = computed(() => {
  return window.innerWidth < 768 ? '90vw' : '500px'
})
</script>
```
