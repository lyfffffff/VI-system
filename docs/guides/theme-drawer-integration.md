# Theme Drawer 接入指南

## 1. 初始化主题
在应用入口执行初始化，恢复本地存储主题状态。

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { initViTheme } from '@yyxxfe/vi'\nimport '@yyxxfe/vi/styles'

const app = createApp(App)
app.mount('#app')

initViTheme()
```

## 2. 页面接入抽屉

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ThemeDrawer } from '@yyxxfe/vi'

const open = ref(false)

function showThemeDrawer() {
  open.value = true
}
</script>

<template>
  <button type="button" @click="showThemeDrawer">主题设置</button>
  <ThemeDrawer v-model:open="open" />
</template>
```

## 3. 局部覆盖推荐写法（3B）
优先在局部容器（推荐 `.vi-theme-scope`）覆盖语义变量：

```vue
<template>
  <section class="vi-theme-scope page-theme-scope">
    <MyPanel />
  </section>
</template>

<style scoped>
.page-theme-scope {
  --vi-color-primary: #0ea5e9;
  --vi-color-primary-rgb: 14, 165, 233;
  --vi-tag-bg: rgba(14, 165, 233, 0.12);
}
</style>
```

说明：
- 局部容器内优先使用局部变量值。
- 未覆写变量自动回退到全局主题值。
- 不建议把直接覆写 `--el-*` 作为常态方案。

## 4. 前缀配置
默认语义前缀是 `vi`，可通过 `useViTheme({ prefix })` 自定义。

```ts
import { useViTheme } from '@yyxxfe/vi'

const { applyTheme } = useViTheme({ prefix: 'brand' })
applyTheme()
```

## 5. 本地预览（Storybook）
在仓库根目录执行：

```bash
pnpm install
pnpm dev:storybook
```

打开 `http://localhost:6006`，在 `Theme/Theme Drawer` 查看：
- Playground
- ThemeRegression（亮/暗 + 17 色）
- ComponentRegression（组件矩阵）
- PrefixAndScopedOverride（prefix + 局部覆盖）

## 6. 回滚建议
若 V2 改造出现大范围样式回归，建议按以下顺序回滚：
1. 回滚 overrides 层（`workbench-overrides.less` 及子文件）。
2. 保留 semantic/mapping 层，继续观察变量链路。
3. 必要时回滚到归档基线 `2026-03-27-adopt-storybook-docs`。

## 7. 注意事项
- 组件层不要直接硬编码主题颜色。
- 主题相关样式优先消费语义变量层。
- V1/V2 不包含水印能力。

