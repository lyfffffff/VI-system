# 表格自动列宽计算方案

基于Canvas文本测量的表格列宽自动计算方案，根据**表头文字+实际数据内容**动态计算每列最小宽度，避免硬编码`min-width`导致的内容截断或换行。

> **参考实现**：`prototypes/vue3-demos/askdata_workbench_demo/src/views/data-cockpit/index.vue`

## 核心原理

1. 使用`Canvas.measureText()`精确测量文本像素宽度
2. 遍历表头文字和所有行数据，取最大宽度
3. 加上padding（列间距）和排序图标宽度，作为`min-width`
4. 通过`computed`响应式计算，数据变化时自动重算

## 工具函数

### getTextWidth - 文本像素宽度测量

```typescript
let _measureCanvas: HTMLCanvasElement | null = null
function getTextWidth(text: string, font: string): number {
  if (!_measureCanvas) _measureCanvas = document.createElement('canvas')
  const ctx = _measureCanvas.getContext('2d')!
  ctx.font = font
  return ctx.measureText(text).width
}
```

**要点**：
- Canvas实例复用（`_measureCanvas`单例），避免重复创建DOM
- `font`参数需与实际CSS字体一致，否则测量不准

### calcColWidth - 列宽计算

```typescript
function calcColWidth(
  headerText: string,
  values: string[],
  { padding = 40, sortPadding = 0, minWidth = 50 } = {}
): number {
  const bodyFont = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC"'
  const headerFont = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC"'
  let max = getTextWidth(headerText, headerFont) + sortPadding
  for (const v of values) {
    const w = getTextWidth(v, bodyFont)
    if (w > max) max = w
  }
  return Math.max(Math.ceil(max + padding), minWidth)
}
```

**参数说明**：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `headerText` | - | 表头显示文字 |
| `values` | - | 该列所有行的**格式化后文本**（不是原始数值） |
| `padding` | 40 | 列左右内边距总和，控制列间距松紧度 |
| `sortPadding` | 0 | 可排序列额外预留排序图标宽度，建议24px |
| `minWidth` | 50 | 最小宽度兜底 |

**padding调参经验**：

| 值 | 效果 |
|----|------|
| 32px | 紧凑，适合列很多的报表 |
| 40px | 适中（推荐默认值） |
| 48px | 宽松，适合列较少的展示型表格 |

### flattenRows - 树形数据展平

```typescript
function flattenRows(rows: any[]): any[] {
  const result: any[] = []
  for (const row of rows) {
    result.push(row)
    if (row.children) result.push(...flattenRows(row.children))
  }
  return result
}
```

树形表格（el-table的tree-props）需要把所有层级的数据都纳入宽度计算。

## 使用方式

### Step 1: 定义格式化函数

```typescript
const fmt = (v: any) => v?.toLocaleString() || '-'
const pct = (v: any, fallback = '-') => v != null ? v + '%' : fallback
const money = (v: any, fallback = '-') => v != null ? '¥' + v : fallback
const trend = (v: any) => {
  const n = v ?? 0
  return (n >= 0 ? '+' : '') + n + '%'
}
```

### Step 2: computed计算所有列宽

```typescript
const autoColWidths = computed(() => {
  const rows = flattenRows(tableData.value || [])
  const sortPad = 24

  return {
    name:    calcColWidth('游戏', rows.map(r => r.name || '-'), { padding: 56 }),
    revenue: calcColWidth('流水', rows.map(r => fmt(r.revenue)), { sortPadding: sortPad }),
    cost:    calcColWidth('消耗', rows.map(r => fmt(r.cost)), { sortPadding: sortPad }),
    roi:     calcColWidth('ROI', rows.map(r => pct(r.roi)), { sortPadding: sortPad }),
    // ...其他列
  }
})
```

### Step 3: 模板中绑定

```vue
<!-- 之前：硬编码 -->
<el-table-column prop="revenue" min-width="90" />

<!-- 之后：动态计算 -->
<el-table-column prop="revenue" :min-width="autoColWidths.revenue" />
```

## 特殊场景处理

### 固定列(fixed)

固定列同样使用`:min-width`绑定，name列通常需要更大的padding来容纳树展开图标和缩进：

```typescript
name: calcColWidth('游戏', rows.map(r => r.name), { padding: 56, minWidth: 120 })
```

### 同环比小列

同环比列表头通常只有一个字（"环"/"同"），数据是`+12.5%`这类短文本，可设小minWidth：

```typescript
revenueMom: calcColWidth('环', rows.map(r => trend(r.revenueMom)), { minWidth: 50 })
```

### 字体不一致

如果表头/表体字号不同（如表头12px、表体14px），需要分别指定font：

```typescript
const bodyFont = '14px ...'
const headerFont = '600 12px ...'
```

## 注意事项

1. **font字符串必须与CSS一致**：如果页面字体是14px PingFang SC，测量时也必须用同样的font，否则宽度偏差
2. **格式化文本而非原始值**：传入`calcColWidth`的values必须是格式化后的显示文本（如`"1,234,567"`而非`1234567`）
3. **性能**：Canvas.measureText非常快，几百行×几十列的表格完全无压力，无需担心性能
4. **SSR兼容**：如需SSR，Canvas不可用时应fallback到字符数估算
