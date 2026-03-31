import type { IThemeVariants, ThemeColorKey } from '../types/theme'

const WARM_THEME_KEYS: ThemeColorKey[] = ['red', 'orange', 'amber', 'yellow', 'pink', 'rose']

const WARM_LIGHT_BG = 'linear-gradient(180deg, #fcf3eb 0%, #faf6f0 48%, #f8f6f3 100%)'
const COLD_LIGHT_BG = 'linear-gradient(180deg, #e8f0fb 0%, #eef3fb 48%, #f2f6fb 100%)'
const DARK_BG = 'linear-gradient(180deg, #141618 0%, #111214 48%, #0f1012 100%)'

function clamp(value: number): number {
  if (value < 0) return 0
  if (value > 255) return 255
  return Math.round(value)
}

function parseHex(hex: string): [number, number, number] {
  const raw = hex.replace('#', '')
  const norm = raw.length === 3 ? raw.split('').map((char) => `${char}${char}`).join('') : raw

  const r = Number.parseInt(norm.slice(0, 2), 16)
  const g = Number.parseInt(norm.slice(2, 4), 16)
  const b = Number.parseInt(norm.slice(4, 6), 16)

  return [r, g, b]
}

function toHex([r, g, b]: [number, number, number]): string {
  const toPart = (num: number) => clamp(num).toString(16).padStart(2, '0')
  return `#${toPart(r)}${toPart(g)}${toPart(b)}`
}

function mixRgb(base: [number, number, number], target: [number, number, number], weight: number): [number, number, number] {
  const value = (a: number, b: number) => a + (b - a) * weight
  return [value(base[0], target[0]), value(base[1], target[1]), value(base[2], target[2])]
}

export function hexToRgb(hex: string): string {
  const [r, g, b] = parseHex(hex)
  return `${r},${g},${b}`
}

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

export function generatePageBackground(rgb: string, isDark: boolean, themeKey: ThemeColorKey): string {
  const halo = isDark ? 0.06 : 0.12

  if (isDark) {
    return `radial-gradient(circle at top right, rgba(${rgb},${halo}), transparent 32%), ${DARK_BG}`
  }

  const bgGradient = WARM_THEME_KEYS.includes(themeKey) ? WARM_LIGHT_BG : COLD_LIGHT_BG
  return `radial-gradient(circle at top right, rgba(${rgb},${halo}), transparent 32%), ${bgGradient}`
}

export function normalizePrefix(prefix = 'vi'): string {
  return prefix.trim().replace(/^-+/, '').replace(/-+$/, '') || 'vi'
}

export function createVarName(prefix: string, token: string): string {
  return `--${normalizePrefix(prefix)}-${token}`
}
