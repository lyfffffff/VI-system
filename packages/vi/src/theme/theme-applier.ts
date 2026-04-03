// 主题注入器：负责将变量写入根节点，并同步 dataset 与 dark class。
import type { ThemeColorKey } from './theme-config'
import type { IThemeVarMap } from './theme-resolver'

/**
 * 根节点主题注入载荷。
 */
export interface IThemeApplyPayload {
  /** 当前主题 key。 */
  themeKey: ThemeColorKey
  /** 当前变量前缀。 */
  prefix: string
  /** 当前暗黑模式状态。 */
  isDark: boolean
  /** 需要写入根节点的变量映射列表。 */
  varMaps: IThemeVarMap[]
}

function canUseDom(): boolean {
  return typeof document !== 'undefined' && typeof window !== 'undefined'
}

function applyVarMap(target: HTMLElement, vars: IThemeVarMap): void {
  for (const [name, value] of Object.entries(vars)) {
    target.style.setProperty(name, value)
  }
}

/**
 * 将解析结果应用到根节点。
 * @param payload 主题注入载荷。
 */
export function applyThemeToRoot(payload: IThemeApplyPayload): void {
  if (!canUseDom()) return

  const root = document.documentElement

  for (const vars of payload.varMaps) {
    applyVarMap(root, vars)
  }

  root.dataset.theme = payload.themeKey
  root.dataset.viPrefix = payload.prefix

  if (payload.isDark) {
    root.classList.add('dark')
    return
  }

  root.classList.remove('dark')
}
