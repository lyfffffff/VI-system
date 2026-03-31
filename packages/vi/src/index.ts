import './styles/tokens.less'
import './styles/semantic-vars.less'
import './styles/element-plus-mapping.less'
import './styles/workbench-mapping.less'
import './styles/workbench-overrides.less'

export { initViTheme } from './theme/init-theme'
export { useViTheme } from './composables/use-vi-theme'
export { THEME_PRESETS, DEFAULT_THEME } from './theme/theme-config'
export type { ThemeColorKey, IThemePreset, IThemeVariants, IViThemeOptions, IViThemeState } from './types/theme'

export { default as ThemeDrawer } from './components/theme-drawer'
