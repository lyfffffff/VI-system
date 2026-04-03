// 主题色计算工具：负责颜色变体、背景渐变和 CSS 变量命名规范化。
import type { IThemeVariants, ThemeColorKey } from '../types/theme'

const WARM_THEME_KEYS: ThemeColorKey[] = ['red', 'orange', 'amber', 'yellow', 'pink', 'rose']

const WARM_LIGHT_BG = 'linear-gradient(180deg, #fcf3eb 0%, #faf6f0 48%, #f8f6f3 100%)'
const COLD_LIGHT_BG = 'linear-gradient(180deg, #eef3fb 0%, #f4f7fc 48%, #f6f8fb 100%)'
const DARK_BG = 'linear-gradient(180deg, #141618 0%, #111214 48%, #0f1012 100%)'

function clamp(value: number): number {
  if (value < 0) return 0
  if (value > 255) return 255
  return Math.round(value)
}

// 将十六进制颜色解析为 RGB 数组，支持 #rgb / #rrggbb 两种格式。
function parseHex(hex: string): [number, number, number] {
  const raw = hex.replace('#', '')
  const norm = raw.length === 3 ? raw.split('').map((char) => `${char}${char}`).join('') : raw

  const r = Number.parseInt(norm.slice(0, 2), 16)
  const g = Number.parseInt(norm.slice(2, 4), 16)
  const b = Number.parseInt(norm.slice(4, 6), 16)

  return [r, g, b]
}

// 将 RGB 数组格式化为十六进制颜色字符串。
function toHex([r, g, b]: [number, number, number]): string {
  const toPart = (num: number) => clamp(num).toString(16).padStart(2, '0')
  return `#${toPart(r)}${toPart(g)}${toPart(b)}`
}

// 按权重线性混合两组 RGB。
function mixRgb(base: [number, number, number], target: [number, number, number], weight: number): [number, number, number] {
  const value = (a: number, b: number) => a + (b - a) * weight
  return [value(base[0], target[0]), value(base[1], target[1]), value(base[2], target[2])]
}

/**
 * 将十六进制颜色转换为 "r, g, b" 字符串，供 `rgba()` 与 CSS 变量复用。
 * @param hex 十六进制颜色值（支持 `#rgb` / `#rrggbb`）。
 * @returns 形如 `"20,184,166"` 的 RGB 字符串。
 */
export function hexToRgb(hex: string): string {
  const [r, g, b] = parseHex(hex)
  return `${r},${g},${b}`
}

/**
 * 生成主题主色的亮阶与暗阶变体。
 * @param hex 十六进制主题主色。
 * @returns 包含 `light3/light5/light7/light8/light9/dark2` 的颜色变体集合。
 */
export function getThemeVariants(hex: string): IThemeVariants {
  const rgb = parseHex(hex)
  const white: [number, number, number] = [255, 255, 255]
  const black: [number, number, number] = [0, 0, 0]

  return {
    light3: toHex(mixRgb(rgb, white, 0.3)),
    light5: toHex(mixRgb(rgb, white, 0.5)),
    light7: toHex(mixRgb(rgb, white, 0.7)),
    light8: toHex(mixRgb(rgb, white, 0.8)),
    light9: toHex(mixRgb(rgb, white, 0.9)),
    dark2: toHex(mixRgb(rgb, black, 0.2)),
  }
}

/**
 * 生成页面背景渐变。
 * @param rgb 主题主色 RGB 字符串（如 `"20,184,166"`）。
 * @param isDark 是否为暗黑模式。
 * @param themeKey 当前主题 key，用于冷热色背景模板选择。
 * @returns 页面背景 CSS 渐变值。
 */
export function generatePageBackground(rgb: string, isDark: boolean, themeKey: ThemeColorKey): string {
  const halo = isDark ? 0.06 : 0.12

  if (isDark) {
    return `radial-gradient(circle at top right, rgba(${rgb},${halo}), transparent 32%), ${DARK_BG}`
  }

  const bgGradient = WARM_THEME_KEYS.includes(themeKey) ? WARM_LIGHT_BG : COLD_LIGHT_BG
  return `radial-gradient(circle at top right, rgba(${rgb},${halo}), transparent 32%), ${bgGradient}`
}

/**
 * 规范化 CSS 变量前缀。
 * @param prefix 原始前缀。
 * @returns 合法前缀（为空或非法时回退为 `vi`）。
 */
export function normalizePrefix(prefix = 'vi'): string {
  return prefix.trim().replace(/^-+/, '').replace(/-+$/, '') || 'vi'
}

/**
 * 基于前缀与 token 构建 CSS 变量名。
 * @param prefix 变量前缀。
 * @param token 变量 token 名称。
 * @returns 完整 CSS 变量名（如 `--vi-color-primary`）。
 */
export function createVarName(prefix: string, token: string): string {
  return `--${normalizePrefix(prefix)}-${token}`
}
