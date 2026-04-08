# Theme Drawer

## 功能
- 支持 17 个预设主题色切换。
- 支持浅色 / 暗黑模式切换。
- 提供右侧抽屉交互与标准事件输出。
- 不包含水印功能（V1/V2 均排除）。

## V2 主题扩展契约
- 组件样式改造优先级：`CSS var > 业务 class > 直接覆盖组件内部样式`。
- 推荐局部覆盖作用域：`.vi-theme-scope`。
- 业务局部覆盖仅建议改语义变量（`--vi-*`），不建议常态化直接覆写 `--el-*`。

## 组件示例
```vue
<ThemeDrawer
  v-model:open="open"
  placement="right"
  @update:open="handleOpen"
  @theme-change="handleThemeChange"
  @mode-change="handleModeChange"
/>
```

## ThemeDrawer 结构线框图（纯文本）
```text
┌────────────────────────────────────────────────────────┐
│ ThemeDrawer（vi-theme-drawer）                        │
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

## Props
| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | 抽屉是否打开（支持 `v-model:open`） |
| `placement` | `'right' \| 'left'` | `'right'` | 抽屉出现方向 |
| `themes` | `IThemePreset[]` | `THEME_PRESETS` | 自定义主题列表 |

## 回调钩子（Emits）
| 事件名 | 参数签名 | 触发时机 |
| --- | --- | --- |
| `update:open` | `(open: boolean) => void` | 抽屉开关状态变化（关闭按钮、遮罩关闭、外部控制） |
| `theme-change` | `(themeKey: ThemeColorKey) => void` | 用户在抽屉中选择新主题且切换成功后 |
| `mode-change` | `(isDark: boolean) => void` | 用户切换浅色/暗黑模式且状态变化后 |

## 初始化约束（必须）
`initViTheme(options)` 是主题系统唯一配置入口，建议在应用入口执行一次。

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { initViTheme } from '@yyxxfe/vi'
import '@yyxxfe/vi/styles'

const app = createApp(App)
app.mount('#app')

initViTheme({ defaultThemeKey: 'blue' })
```

说明：
- `defaultThemeKey` 仅在“无持久化值”时生效。
- 一旦用户切换主题并写入存储，刷新后会优先恢复用户上次选择。
- `useViTheme()` 只负责读取/操作全局主题状态，不负责初始化配置。

## 页面接入示例
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ThemeDrawer, initViTheme } from '@yyxxfe/vi'
import '@yyxxfe/vi/styles'
import type { ThemeColorKey } from '@yyxxfe/vi'

const open = ref(false)
initViTheme({ defaultThemeKey: 'blue' })

function handleOpen(nextOpen: boolean) {
  open.value = nextOpen
}

function handleThemeChange(themeKey: ThemeColorKey) {
  console.log('theme-change', themeKey)
}

function handleModeChange(isDark: boolean) {
  console.log('mode-change', isDark)
}
</script>

<template>
  <button type="button" @click="open = true">主题设置</button>

  <ThemeDrawer
    v-model:open="open"
    @update:open="handleOpen"
    @theme-change="handleThemeChange"
    @mode-change="handleModeChange"
  />
</template>
```

## 局部覆盖推荐（3B）
优先在局部容器（推荐 `.vi-theme-scope`）覆盖语义变量，不直接常态化覆写 `--el-*`。

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

## 本地预览
```bash
pnpm install
pnpm dev:storybook
```

## 相关 API
- `useViTheme()`：主题状态与切换能力（读取/操作，不做初始化配置）。
- `initViTheme()`：应用初始化主题（唯一配置入口）。
- 变量映射清单：`docs/guides/theme-mapping-checklist.md`。
- Storybook 指南：`docs/guides/storybook-guide.md`。

