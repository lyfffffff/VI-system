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

## 页面接入完整示例
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ThemeDrawer } from '@yyxxfe/vi'\nimport '@yyxxfe/vi/styles'
import type { ThemeColorKey } from '@yyxxfe/vi'

const open = ref(false)

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

## 相关 API
- `useViTheme()`：主题状态与切换能力。
- `initViTheme()`：应用初始化主题。
- 变量映射清单：`docs/guides/theme-mapping-checklist.md`。

