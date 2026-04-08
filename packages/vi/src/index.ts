// VI 库主入口：聚合样式注入、主题能力与组件导出。
import './styles/tokens.less'
import './styles/semantic-vars.less'
import './styles/element-plus-mapping.less'
import './styles/workbench-mapping.less'
import './styles/workbench-overrides.less'

export { initViTheme } from './theme/init-theme'
export { useViTheme } from './composables/use-vi-theme'
export { useAutoTableColWidth } from './composables/use-auto-table-col-width'
export { THEME_PRESETS, DEFAULT_THEME } from './theme/theme-config'
export { getThemeVariants } from './utils/color-utils'
export type { ThemeColorKey, IThemePreset, IThemeVariants, IViThemeOptions, IViThemeState } from './types/theme'
export type { IAutoTableColWidthColumn, IAutoTableColWidthOptions } from './composables/use-auto-table-col-width'

export { default as ThemeDrawer } from './components/theme-drawer'
