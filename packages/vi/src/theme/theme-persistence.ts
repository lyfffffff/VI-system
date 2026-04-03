// 主题持久化：统一封装 localStorage 读写与容错。
/**
 * 存储层主题状态结构。
 */
export interface IThemePersistedState {
  /** 主题 key。 */
  themeKey: string
  /** 暗黑模式状态。 */
  isDark: boolean
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function readStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (!canUseStorage()) return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 忽略浏览器禁用存储等异常
  }
}

/**
 * 读取主题持久化状态。
 * @param themeStorageKey 主题 key 存储键。
 * @param darkStorageKey 暗黑状态存储键。
 * @param fallbackThemeKey 主题 key 回退值（无存储或解析失败时使用）。
 * @returns 主题持久化状态。
 */
export function readPersistedThemeState(
  themeStorageKey: string,
  darkStorageKey: string,
  fallbackThemeKey: string,
): IThemePersistedState {
  return {
    themeKey: readStorage(themeStorageKey, fallbackThemeKey),
    isDark: readStorage(darkStorageKey, false),
  }
}

/**
 * 写入主题持久化状态。
 * @param themeStorageKey 主题 key 存储键。
 * @param darkStorageKey 暗黑状态存储键。
 * @param state 需要持久化的主题状态。
 * @returns 无返回值。
 */
export function writePersistedThemeState(
  themeStorageKey: string,
  darkStorageKey: string,
  state: IThemePersistedState,
): void {
  writeStorage(themeStorageKey, state.themeKey)
  writeStorage(darkStorageKey, state.isDark)
}
