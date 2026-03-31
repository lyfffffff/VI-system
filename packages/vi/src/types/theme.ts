export type ThemeColorKey = import('../theme/theme-config').ThemeColorKey

export interface IThemePreset<TKey extends string = string> {
  key: TKey
  order: number
  name: string
  englishName: string
  hex: string
  rgb: string
}

export interface IThemeVariants {
  light3: string
  light5: string
  light7: string
  light8: string
  light9: string
  dark2: string
}

export interface IViThemeOptions {
  prefix?: string
  themeStorageKey?: string
  darkStorageKey?: string
}

export interface IViThemeState {
  themeKey: ThemeColorKey
  isDark: boolean
}
