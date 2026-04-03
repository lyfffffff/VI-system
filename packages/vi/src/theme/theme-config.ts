// 主题配置单一数据源：定义预设主题、默认值和存储键。
import type { IThemePreset } from '../types/theme'
import { hexToRgb } from '../utils/color-utils'

const EXPECTED_THEME_COUNT = 17
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i

const THEME_PRESET_SOURCE = [
  { key: 'red', name: '热烈红色', englishName: 'Red', hex: '#ef4444' },
  { key: 'orange', name: '活力橙色', englishName: 'Orange', hex: '#f97316' },
  { key: 'amber', name: '琥珀暖黄', englishName: 'Amber', hex: '#f59e0b' },
  { key: 'yellow', name: '明亮黄色', englishName: 'Yellow', hex: '#eab308' },
  { key: 'lime', name: '青柠绿色', englishName: 'Lime', hex: '#84cc16' },
  { key: 'green', name: '翠绿色', englishName: 'Green', hex: '#22c55e' },
  { key: 'emerald', name: '祖母绿', englishName: 'Emerald', hex: '#10b981' },
  { key: 'teal', name: '青绿色', englishName: 'Teal', hex: '#14b8a6' },
  { key: 'cyan', name: '青蓝色', englishName: 'Cyan', hex: '#06b6d4' },
  { key: 'sky', name: '天空蓝', englishName: 'Sky', hex: '#0ea5e9' },
  { key: 'blue', name: '经典蓝', englishName: 'Blue', hex: '#3b82f6' },
  { key: 'indigo', name: '靛青色', englishName: 'Indigo', hex: '#6366f1' },
  { key: 'violet', name: '紫罗兰', englishName: 'Violet', hex: '#8b5cf6' },
  { key: 'purple', name: '纯紫色', englishName: 'Purple', hex: '#a855f7' },
  { key: 'fuchsia', name: '品红紫', englishName: 'Fuchsia', hex: '#d946ef' },
  { key: 'pink', name: '粉红色', englishName: 'Pink', hex: '#ec4899' },
  { key: 'rose', name: '玫瑰红', englishName: 'Rose', hex: '#f43f5e' },
] as const

/** 主题预设 key 联合类型。 */
export type ThemeColorKey = (typeof THEME_PRESET_SOURCE)[number]['key']

// 启动时校验主题配置，避免重复 key、数量偏差和非法色值进入运行时。
function validateThemePresetSource(): void {
  if (THEME_PRESET_SOURCE.length !== EXPECTED_THEME_COUNT) {
    throw new Error(`Theme preset count mismatch: expected ${EXPECTED_THEME_COUNT}, got ${THEME_PRESET_SOURCE.length}`)
  }

  const keySet = new Set<string>()

  for (const item of THEME_PRESET_SOURCE) {
    if (keySet.has(item.key)) {
      throw new Error(`Duplicate theme key detected: ${item.key}`)
    }

    if (!HEX_COLOR_PATTERN.test(item.hex)) {
      throw new Error(`Invalid theme hex color for key ${item.key}: ${item.hex}`)
    }

    keySet.add(item.key)
  }
}

validateThemePresetSource()

/** 系统默认主题 key。 */
export const DEFAULT_THEME: ThemeColorKey = 'teal'

/** 主题 key 的默认存储键。 */
export const THEME_STORAGE_KEY = 'vi-theme-key'
/** 暗黑模式状态的默认存储键。 */
export const DARK_STORAGE_KEY = 'vi-theme-dark'

/** 对外暴露的主题预设列表。 */
export const THEME_PRESETS: IThemePreset<ThemeColorKey>[] = THEME_PRESET_SOURCE.map((item, index) => ({
  ...item,
  order: index + 1,
  rgb: hexToRgb(item.hex),
}))

/** 主题 key 到预设详情的快速查询表。 */
export const THEME_PRESET_MAP = THEME_PRESETS.reduce<Record<ThemeColorKey, IThemePreset<ThemeColorKey>>>((acc, item) => {
  acc[item.key] = item
  return acc
}, {} as Record<ThemeColorKey, IThemePreset<ThemeColorKey>>)
