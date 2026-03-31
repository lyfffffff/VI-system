---
name: vi-system-code-style
description: VI 系统纯代码规范：文件与符号命名、注释、目录与模块化拆分、Vue 3 + TypeScript + Less 的写法约定。当用户要求按项目规范写代码、重构、评审风格或统一结构时使用；不涉及具体业务与产品流程。
metadata:
  short-description: VI 系统命名 / 注释 / 模块化规范
---

# VI System Code Style

面向 **命名、注释、模块化** 及 **Vue / TS / Less** 的写法一致性，不描述业务需求或交付流程。

## 模块化与目录

- **组件**：`packages/vi/src/components/<组件名>/`，主 SFC 与同目录下的子组件、局部资源放在一起，避免同级目录堆叠散乱文件。
- **组合式函数**：`packages/vi/src/composables/`，`use-*.ts`，与导出函数名对应（如 `use-vi-theme.ts` → `useViTheme`）。
- **工具**：`packages/vi/src/utils/`（或项目约定的工具目录），`kebab-case.ts`，单文件职责单一。
- **共享类型**：`packages/vi/src/types/`，按领域分文件（如 `theme.ts`），避免在单个 `.vue` 内堆放大块可复用类型。
- **样式**：库内公共样式在 `packages/vi/src/styles/` 按现有子目录组织；组件私有样式放在 SFC 的 `<style scoped>`。跨文件样式依赖用 `@import`，勿重复粘贴大块变量定义。
- **导入**：优先使用项目已配置的别名（如 `@/`）；同包内相对路径保持深度合理，避免无意义的 `../../../` 可抽公共入口时再议。

## 命名约定

| 种类 | 规则 | 示例 |
|------|------|------|
| Vue 单文件 | `kebab-case.vue` | `theme-drawer.vue` |
| Composables | `use-xxx.ts` | `use-vi-theme.ts` |
| 工具模块 | `kebab-case.ts` | `color-utils.ts` |
| 导出且跨文件复用的 interface | `I` 前缀 | `IViThemeOptions` |
| 组件内联类型 | `interface Props`，emit 载荷具名类型 | 不必强加 `I` 前缀 |
| 组件类名（CSS） | BEM：`block__element--modifier` | `.theme-drawer__header--collapsed` |

组件名（`defineOptions` / 全局注册若有）与文件夹名语义一致。常量使用 `UPPER_SNAKE` 或项目既有惯例，同一文件内统一。

## Vue 组件（`<script setup lang="ts">`）

**推荐书写顺序**（与仓库现状对齐即可）：`import` → 类型 → `defineProps` / `withDefaults` → `defineEmits` → `ref` / `reactive` → `computed` → 生命周期 → 函数 → `defineExpose`（按需）。

- **Props**：`interface Props` + `withDefaults(defineProps<Props>(), { ... })`；可选 props 的默认值写明确（含 `undefined` / `false`），避免出现依赖隐式行为的布尔值。
- **Emits**：`defineEmits<{ name: [Payload] }>()`，事件名与载荷类型写清。
- **逻辑复用**：与状态/副作用相关的重复逻辑抽到 composable 或 util，组件内只保留编排与模板和样式绑定。

`<style>`：默认 `scoped` + `lang="less"`（与项目一致）；类名见上表 BEM；颜色与尺寸优先使用已有 **CSS 变量**，避免在组件内散落硬编码色值（具体变量表由样式实现维护，本 skill 不要求展开）。

## TypeScript

- 对外导出函数、composable 返回值、复用类型：**显式标注类型**。
- 避免 `any`；边界处用 `unknown` 再收窄，或在单行 `any` 旁注释原因。
- `type` 与 `interface`：对外 API、扩展需求多用 `interface`；联合、工具类型用 `type`；与现有文件保持一致。

## 注释

- **写**：导出符号、非显然的约束与约定、复杂分支或性能/兼容性取舍（简短说明「为什么」）。
- **不写**：翻译代码行为、显而易见的花括号说明、过时或与实现不符的注释。

JSDoc：`/** ... */` 用于导出的 props 字段、公共函数参数与返回值即可，避免对内联变量逐行堆砌。

## 结构示例（缩减）

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  /** 是否展示 */
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})

const emit = defineEmits<{
  close: []
}>()

const open = ref(props.visible)
const isOpen = computed(() => open.value)
</script>

<template>...</template>

<style scoped lang="less">
.block__title {
  color: var(--vi-text-primary);
}
</style>
```