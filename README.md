# VI System

## 项目本质
VI System 是一个面向 Vue 3 生态的“主题能力公共库 + 文档回归工程”：
- `packages/vi` 提供可复用的主题引擎、主题变量体系与主题抽屉组件。
- `apps/storybook` 作为唯一文档与回归入口，用于演示与验证主题能力在真实页面原型中的表现。

它的核心目标不是承载完整业务，而是为业务项目提供稳定、可迁移、可验证的主题基础设施。

## 核心功能
- 固定 17 个预设主题色，支持即时切换。
- 浅色 / 暗黑模式切换（基于 `html.dark` + 运行时变量注入）。
- 主题状态持久化（刷新后恢复用户选择）。
- `ThemeDrawer` 组件：统一提供主题与模式切换交互。
- Storybook 回归场景：
  - `主题/主题抽屉`
  - `主题/原型回归`（data-cockpit 高保真模块回归）。

## 目录结构（关键部分）
```text
VI-system/
├─ apps/
│  └─ storybook/
│     ├─ .storybook/
│     │  ├─ main.ts
│     │  ├─ preview.ts
│     │  ├─ preview.css
│     │  └─ preview.stories.css
│     └─ src/stories/
│        ├─ theme-drawer.stories.ts
│        ├─ prototype-regression.stories.ts
│        |─ prototype-regression/*.vue
|        └─ theme-drawer/*.vue
├─ packages/
│  └─ vi/
│     ├─ src/components/theme-drawer/
│     ├─ src/composables/use-vi-theme.ts
│     ├─ src/theme/
│     │  ├─ init-theme.ts
│     │  ├─ theme-engine.ts
│     │  ├─ theme-resolver.ts
│     │  ├─ theme-applier.ts
│     │  └─ theme-persistence.ts
│     ├─ src/styles/
│     │  ├─ tokens.less
│     │  ├─ semantic-vars.less
│     │  ├─ element-plus-mapping.less
│     │  ├─ workbench-mapping.less
│     │  ├─ workbench-overrides.less
│     │  ├─ element-ui/*.less
│     │  └─ workbench/*.less
│     └─ src/index.ts
├─ docs/guides/
└─ openspec/
   ├─ specs/
   └─ changes/archive/
```

## 快速开始（Storybook）
前置要求：
- Node.js（建议 LTS）
- `pnpm@9.12.0`（见根 `package.json`）

安装依赖：
```bash
pnpm install
```

启动 Storybook：
```bash
pnpm dev:storybook
```

构建/预览文档站点：
```bash
pnpm build:storybook
pnpm preview:storybook
```

## 在目标项目中使用本库

### 1. 安装与依赖
本库依赖 `vue`、`element-plus`、`@element-plus/icons-vue`。

在同一 monorepo 下，推荐用 workspace 方式接入：
```json
{
  "dependencies": {
    "@yyxxfe/vi": "workspace:*",
    "element-plus": "^2.11.3",
    "@element-plus/icons-vue": "^2.3.2",
    "vue": "^3.5.18"
  }
}
```

### 2. 应用入口初始化（唯一配置入口）
```ts
import { createApp } from "vue";
import App from "./App.vue";
import { initViTheme } from "@yyxxfe/vi";
import "@yyxxfe/vi/styles";

const app = createApp(App);
app.mount("#app");

initViTheme({
  defaultThemeKey: "blue",
});
```

### 3. 页面中使用主题能力
```vue
<script setup lang="ts">
import { ref } from "vue";
import { ThemeDrawer, useViTheme } from "@yyxxfe/vi";

const open = ref(false);
const { toggleDark } = useViTheme();
</script>

<template>
  <button type="button" @click="open = true">主题设置</button>
  <button type="button" @click="toggleDark()">切换明暗</button>
  <ThemeDrawer v-model:open="open" />
</template>
```

### 4. 业务局部覆盖（推荐）
```css
.vi-theme-scope {
  --vi-color-primary: #0ea5e9;
  --vi-color-primary-rgb: 14, 165, 233;
}
```

建议优先覆盖语义变量（`--vi-*`），不要把直接覆盖 `--el-*` 作为常规方案。

## 参考文档
- `docs/guides/storybook-guide.md`
- `docs/guides/theme-drawer.md`
- `docs/guides/theme-mapping-checklist.md`
- `openspec/specs/theme-system/spec.md`
- `openspec/specs/component-docs/spec.md`
