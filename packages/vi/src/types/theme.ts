// 主题相关共享类型：为主题配置、状态与对外 API 提供统一契约。
export type ThemeColorKey = import('../theme/theme-config').ThemeColorKey

export interface IThemePreset<TKey extends string = string> {
  /** @description 主题唯一键。 */
  key: TKey
  /** @description 展示顺序。 */
  order: number
  /** @description 中文名称。 */
  name: string
  /** @description 英文名称。 */
  englishName: string
  /** @description 十六进制主色。 */
  hex: string
  /** @description RGB 字符串。 */
  rgb: string
}

export interface IThemeVariants {
  /** @description 主色亮阶 3。 */
  light3: string
  /** @description 主色亮阶 5。 */
  light5: string
  /** @description 主色亮阶 7。 */
  light7: string
  /** @description 主色亮阶 8。 */
  light8: string
  /** @description 主色亮阶 9。 */
  light9: string
  /** @description 主色暗阶 2。 */
  dark2: string
}

export interface IViThemeOptions {
  /** @description CSS 变量前缀。 */
  prefix?: string
  /** @description 主题 key 本地存储键名。 */
  themeStorageKey?: string
  /** @description 暗黑模式本地存储键名。 */
  darkStorageKey?: string
}

export interface IViThemeState {
  /** @description 当前主题 key。 */
  themeKey: ThemeColorKey
  /** @description 当前是否为暗黑模式。 */
  isDark: boolean
}
