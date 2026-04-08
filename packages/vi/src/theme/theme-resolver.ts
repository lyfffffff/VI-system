// 主题解析器：根据主题状态计算语义变量字典（纯函数，不访问 DOM / Storage）。
import { THEME_PRESET_MAP, type ThemeColorKey } from './theme-config'
import { createVarName, generatePageBackground, getThemeVariants } from '../utils/color-utils'

/** 主题变量映射结构：`CSS 变量名 -> 变量值`。 */
export type IThemeVarMap = Record<string, string>

/**
 * 解析语义变量映射（固定输出 `--vi-*`）。
 * @param themeKey 主题 key。
 * @param isDark 是否暗黑模式。
 * @returns 变量名到变量值的映射。
 */
export function resolveThemeVarMap(themeKey: ThemeColorKey, isDark: boolean): IThemeVarMap {
  const preset = THEME_PRESET_MAP[themeKey]
  const variants = getThemeVariants(preset.hex, isDark)

  // 交互态相关的半透明色值，按亮/暗模式微调透明度。
  const focusRing = `rgba(${preset.rgb}, 0.26)`
  const sidebarActive = `rgba(${preset.rgb}, ${isDark ? '0.22' : '0.14'})`
  const sidebarHover = `rgba(${preset.rgb}, ${isDark ? '0.14' : '0.06'})`
  const tagBg = `rgba(${preset.rgb}, ${isDark ? '0.2' : '0.1'})`
  const tagBorder = `rgba(${preset.rgb}, ${isDark ? '0.32' : '0.16'})`

  const pageBg = generatePageBackground(preset.rgb, isDark, themeKey)

  // 语义变量分组：主色阶 + 页面/焦点 + 业务壳层（sidebar/tag）。
  const vars: IThemeVarMap = {
    [createVarName('color-primary')]: preset.hex,
    [createVarName('color-primary-rgb')]: preset.rgb,
    [createVarName('color-primary-light-3')]: variants.light3,
    [createVarName('color-primary-light-5')]: variants.light5,
    [createVarName('color-primary-light-7')]: variants.light7,
    [createVarName('color-primary-light-8')]: variants.light8,
    [createVarName('color-primary-light-9')]: variants.light9,
    [createVarName('color-primary-dark-2')]: variants.dark2,

    [createVarName('page-bg')]: pageBg,
    [createVarName('focus-ring')]: focusRing,

    [createVarName('sidebar-item-active')]: sidebarActive,
    [createVarName('sidebar-item-hover')]: sidebarHover,
    [createVarName('tag-bg')]: tagBg,
    [createVarName('tag-border')]: tagBorder,
    [createVarName('tag-text')]: preset.hex,
  }

  return vars
}
