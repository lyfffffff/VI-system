## 规范

### 主要说明

本节定义项目执行边界与决策依据：输入来源、工程规范、事实校验标准与 OpenSpec 变更流程，确保后续实现和样式裁决可追溯、可复现。

### 输入基线

- 主题/样式统一仅使用以下来源：
  - `junelce-workbench-design-system`
  - `askdata-dashboard / data-cockpit`（原型实现基线）
- 禁止引入未约定来源作为视觉裁决依据。

### 项目规范

- 代码与工程规范：`.codex/skills/vi-system-code-style/SKILL.md`
- 对话与事实校验规范：`.codex/skills/advanced-civilization/SKILL.md`

### 工作流（OpenSpec）

- 活跃规范：`openspec/specs/*`
- 变更工作区：`openspec/changes/*`
- 历史归档：`openspec/changes/archive/*`

标准流程：

1. 先写 `proposal/design/tasks`。
2. 再实施代码。
3. 构建与 Storybook 回归。
4. 归档 change 并回填主规格。

---

## 项目

### 主要说明

本节描述仓库的功能定位、能力边界、目录职责、运行方式与接入方式，用于快速理解“这个库是什么、怎么跑、怎么用”。

### 项目本质

VI System 是主题能力公共库 + Storybook 文档回归工程：

- `packages/vi`：主题引擎、变量体系、ThemeDrawer 组件。
- `apps/storybook`：唯一文档与回归入口。

### 核心能力

- 17 个预设主题色（默认 `teal`）。
- 浅色 / 暗黑模式切换（`html.dark` + 运行时变量注入）。
- 主题持久化恢复。
- `ThemeDrawer` 统一主题入口。

### 项目框架

```text
┌──────────────────────────────────────────────────────────┐
│ Topbar (56px, 透明背景，水平导航)                            │
│ [Logo·品牌] [首页][推广][创编][素材][资产][归因][报表][分析][设置] │
├────────┬─────────────────────────────────────────────────┤
│Sidebar │ TagsView (带底部毛玻璃效果)                        │
│(192px) ├─────────────────────────────────────────────────┤
│可折叠    │ Main Content (el-scrollbar)                      │
│到56px   │ (页面内容区，各种 wb-soft-panel)                   │
└────────┴─────────────────────────────────────────────────┘
```

### 主题组件结构

```text
┌────────────────────────────────────────────────────────┐
│ ThemeDrawer                                            │
├────────────────────────────────────────────────────────┤
│ Header                                                 │
│ [主题设置]                                    [✕ 关闭] │
├────────────────────────────────────────────────────────┤
│ 模式设置                                               │
│ ┌──────────────────────┬──────────────────────┐       │
│ │ 浅色模式             │ 暗黑模式             │       │
│ │ 明亮清爽             │ 护眼舒适             │       │
│ └──────────────────────┴──────────────────────┘       │
├────────────────────────────────────────────────────────┤
│ 主题颜色（Theme Grid）                                │
│ [red][orange][amber][yellow]                          │
│ [lime][green][emerald][teal]                          │
│ [cyan][sky][blue][indigo]                             │
│ [violet][purple][fuchsia][pink]                       │
│ [rose]  （共 17 种）                                   │
├────────────────────────────────────────────────────────┤
│ 交互输出（Emits）                                      │
│ - update:open(open: boolean)                          │
│ - theme-change(themeKey: ThemeColorKey)               │
│ - mode-change(isDark: boolean)                        │
└────────────────────────────────────────────────────────┘
```

### 关键目录

```text
VI-system/
├─ apps/storybook/
│  ├─ .storybook/{main.ts,preview.ts,preview.css,preview.stories.css}
│  └─ src/stories/
│     ├─ theme-drawer*.stories.ts + theme-drawer/*.vue
│     └─ data-cockpit-prototype.stories.ts + data-cockpit-prototype/*.vue
├─ packages/vi/src/
│  ├─ theme/{init-theme,theme-engine,theme-resolver,theme-applier,theme-persistence}.ts
│  ├─ composables/use-vi-theme.ts
│  ├─ components/theme-drawer/*
│  └─ styles/{tokens,semantic-vars,element-plus-mapping,workbench-mapping,workbench-overrides}.less
└─ openspec/
```

### 启动与构建

```bash
pnpm install
pnpm dev:storybook
pnpm build:storybook
pnpm preview:storybook
pnpm build:vi
```

### 在目标项目接入

1. 依赖：`@yyxxfe/vi` + `element-plus` + `@element-plus/icons-vue` + `vue`。
2. 入口初始化（唯一配置入口）：

```ts
import { initViTheme } from "@yyxxfe/vi";
import "@yyxxfe/vi/styles";

initViTheme({ defaultThemeKey: "blue" });
```

`initViTheme(options)` 配置项：

- `defaultThemeKey?: ThemeColorKey`
  - 含义：初始主题 key。
  - 生效规则：仅在“本地没有持久化主题值”时生效；有持久化值时优先恢复持久化。
- `themeStorageKey?: string`
  - 含义：主题 key 的本地存储键名。
  - 用途：多项目同域部署时隔离主题存储，避免互相覆盖。
- `darkStorageKey?: string`
  - 含义：暗黑模式状态的本地存储键名。
  - 用途：与 `themeStorageKey` 类似，用于暗黑状态隔离。

推荐实践：

- 在应用入口只调用一次 `initViTheme`。
- 若需要跨系统隔离主题状态，显式传入 `themeStorageKey/darkStorageKey`。

### 使用主题组件

1. 在应用入口初始化主题引擎并引入样式：

```ts
import { initViTheme } from "@yyxxfe/vi";
import "@yyxxfe/vi/styles";

initViTheme({ defaultThemeKey: "teal" });
```

2. 在页面中挂载 `ThemeDrawer`，用 `v-model:open` 控制开关：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ThemeDrawer, useViTheme } from "@yyxxfe/vi";

const drawerOpen = ref(false);
const { themeKey, isDark } = useViTheme();
</script>

<template>
  <el-button type="primary" @click="drawerOpen = true">主题设置</el-button>
  <ThemeDrawer
    v-model:open="drawerOpen"
    @theme-change="(nextThemeKey) => console.log('theme', nextThemeKey)"
    @mode-change="(nextDark) => console.log('dark', nextDark)"
  />
  <div>当前主题：{{ themeKey }} / 暗黑模式：{{ isDark }}</div>
</template>
```

`useViTheme()` 无入参配置，返回当前主题状态与操作方法：

- `themeKey`：当前主题 key（`Ref<ThemeColorKey>`）。
- `isDark`：当前暗黑状态（`Ref<boolean>`）。
- `currentTheme`：当前主题预设信息（`ComputedRef<IThemePreset>`）。
- `setTheme(themeKey)`：切换主题色。
- `setDark(boolean)`：设置明暗模式。
- `toggleDark()`：切换明暗模式。
- `applyTheme()`：立即重新应用并持久化当前主题状态。

说明：

- `useViTheme` 消费的是全局单例主题引擎状态；多个页面/组件调用会保持同步。
- 长期配置（默认主题与存储键）应放在 `initViTheme`，而不是 `useViTheme`。

---

## design-system

### 主要说明

本节聚焦主题系统的技术主干：Token 分层、变量映射链、运行时注入机制、组件消费路径与修改优先级规则。

### Design Token 主题链结构图

```text
┌──────────────────────────────┐
│ Design Tokens                │
│ tokens.less                  │
└──────────────┬───────────────┘
               │
               v
┌──────────────────────────────┐
│ 语义变量层                   │
│ semantic-vars.less           │
│ --vi-*                       │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       v                v
┌──────────────────┐  ┌──────────────────┐
│ ELP 映射层       │  │ WB 映射层        │
│ element-plus-    │  │ workbench-       │
│ mapping.less     │  │ mapping.less     │
│ --el-*           │  │ --wb-*           │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └─────────┬───────────┘
                   v
┌──────────────────────────────────────────────┐
│ 覆盖层（最小差异）                           │
│ workbench-overrides.less                     │
│ + element-ui/*.less + workbench/*.less       │
└───────────────────────────┬──────────────────┘
                            v
┌──────────────────────────────────────────────┐
│ 组件渲染层                                   │
│ Button / Input / Table / Dialog / ...        │
└──────────────────────────────────────────────┘

运行时注入：useViTheme / initViTheme -> 语义变量层
局部作用域：.vi-theme-scope -> 组件渲染层
```

### 为什么采用这套变量分层

这套分层的目标是同时满足“可换肤”“可维护”“可回归”：

- `tokens`：沉淀设计事实值（颜色、圆角、间距、字号），不绑定具体组件库。
- `semantic-vars (--vi-*)`：把事实值提升为业务可读语义（如文本层级、面板层级、交互态），作为运行时主题切换的核心注入层。
- `mapping (--el-* / --wb-*)`：把语义变量映射给具体组件体系（Element Plus / Workbench），保证框架升级或替换时改动面可控。
- `overrides`：仅处理变量表达不了的结构性差异（如复杂选择器、组件内部状态优先级），保持“最小兜底”。

### 运行时状态流

1. `initViTheme(options)` 初始化全局单例引擎。
2. 读取持久化 `themeKey/isDark`。
3. `theme-resolver` 计算变量（含亮/暗模式分支）。
4. `theme-applier` 注入 CSS 变量并同步 `html.dark`。
5. 组件通过 `--vi-* -> --el-* / --wb-*` 消费主题值。

### Token 设计要点

- 主色：`@vi-token-primary`
  - 默认 Teal，支持 17 主题切换，按主色动态计算色阶并映射到 `--el-color-primary-*`
- 文本色：`@vi-token-text-*`
  - 蓝灰色调，区别于 ELP 默认纯灰
- 边框色：`@vi-token-border-*`
  - 更浅更柔和
- 面板填充：`@vi-token-fill-*`
  - 白色微投影体系
- 背景色：`@vi-token-surface-*`
  - 白色微投影体系
- 圆角：`@vi-radius-*`
  - `xl=14, lg=12, md=10, sm=8, xs=6, xxs=4`
  - 默认控件 `10px`，弹窗/抽屉内控件 `6px`
- 间距：`@vi-spacing-*`
  - `xl=20, lg=16, md=12, sm=8, xs=4`
- 字号：`@vi-font-size-*`
  - 正文 `14px`、表格 `14px`、历史导航栏 `13px`

### 修改原则

1. 先改 `semantic-vars.less`。
2. 再改 `element-plus-mapping.less` / `workbench-mapping.less`。
3. 最后才在 `workbench-overrides.less` 或组件覆盖文件兜底。

---

## story文档

### 主要说明

本节约束 Storybook 的组织方式与回归口径，确保主题能力在演示环境中可验证、可维护，并与实际组件行为一致。

### Story 分组

- `主题/主题抽屉`
  - `Playground`
  - `ThemeVariantSwatches`
  - `ThemeRegression`
- `主题/驾驶舱原型`
  - `DataCockpitPrototype`

### Storybook 配置约束

- `main.ts`
  - `stories`: `../src/**/*.stories.@(ts|tsx|js|jsx|mjs)`
  - `addons`: essentials + interactions
  - `framework`: `@storybook/vue3-vite`
- `preview.ts`
  - 注册 `ElementPlus`
  - 初始化 `initViTheme()`
  - `themeMode` toolbar + decorator 同步亮/暗模式

### 启动

```bash
pnpm dev:storybook
pnpm build:storybook
pnpm preview:storybook
```

### 依赖

- `@storybook/vue3-vite`
- `@storybook/addon-essentials`
- `@storybook/addon-interactions`
- `storybook`
- `element-plus`
- `vue`

### 样式归属规则

- 宿主通用样式：`.storybook/preview.css`
- 演示通用样式：`.storybook/preview.stories.css`
- 业务 story 专属样式：就近放在对应 story 组件 `.vue` 内

### 维护与验收

- 新增/调整 story 后必须同步本文件的“Story 分组（当前）”。
- 主题改动必须至少回归：
  - 主题抽屉场景
  - 驾驶舱原型场景（含亮/暗和关键交互态）
