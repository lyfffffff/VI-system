// 主题解析器：根据主题状态计算语义变量字典（纯函数，不访问 DOM / Storage）。
import { THEME_PRESET_MAP, type ThemeColorKey } from './theme-config'
import { createVarName, generatePageBackground, getThemeVariants, normalizePrefix } from '../utils/color-utils'

/** 主题变量映射结构：`CSS 变量名 -> 变量值`。 */
export type IThemeVarMap = Record<string, string>

/**
 * 解析指定前缀下的语义变量映射。
 * @param prefix CSS 变量前缀。
 * @param themeKey 主题 key。
 * @param isDark 是否暗黑模式。
 * @returns 变量名到变量值的映射。
 */
export function resolveThemeVarMap(prefix: string, themeKey: ThemeColorKey, isDark: boolean): IThemeVarMap {
  const normalizedPrefix = normalizePrefix(prefix)
  const preset = THEME_PRESET_MAP[themeKey]
  const variants = getThemeVariants(preset.hex)

  const focusRing = `rgba(${preset.rgb}, 0.26)`
  const sidebarActive = `rgba(${preset.rgb}, ${isDark ? '0.22' : '0.14'})`
  const sidebarHover = `rgba(${preset.rgb}, ${isDark ? '0.14' : '0.06'})`
  const tagBg = `rgba(${preset.rgb}, ${isDark ? '0.2' : '0.1'})`
  const tagBorder = `rgba(${preset.rgb}, ${isDark ? '0.32' : '0.16'})`

  const pageBg = generatePageBackground(preset.rgb, isDark, themeKey)

  const vars: IThemeVarMap = {
    [createVarName(normalizedPrefix, 'color-primary')]: preset.hex,
    [createVarName(normalizedPrefix, 'color-primary-rgb')]: preset.rgb,
    [createVarName(normalizedPrefix, 'color-primary-light-3')]: variants.light3,
    [createVarName(normalizedPrefix, 'color-primary-light-5')]: variants.light5,
    [createVarName(normalizedPrefix, 'color-primary-light-7')]: variants.light7,
    [createVarName(normalizedPrefix, 'color-primary-light-8')]: variants.light8,
    [createVarName(normalizedPrefix, 'color-primary-light-9')]: variants.light9,
    [createVarName(normalizedPrefix, 'color-primary-dark-2')]: variants.dark2,

    [createVarName(normalizedPrefix, 'page-bg')]: pageBg,
    [createVarName(normalizedPrefix, 'focus-ring')]: focusRing,

    [createVarName(normalizedPrefix, 'sidebar-item-active')]: sidebarActive,
    [createVarName(normalizedPrefix, 'sidebar-item-hover')]: sidebarHover,
    [createVarName(normalizedPrefix, 'tag-bg')]: tagBg,
    [createVarName(normalizedPrefix, 'tag-border')]: tagBorder,
    [createVarName(normalizedPrefix, 'tag-text')]: preset.hex,
  }

  return vars
}
