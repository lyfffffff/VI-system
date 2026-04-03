// 主题引擎：全局单例编排主题状态、变量注入与持久化。
import { DARK_STORAGE_KEY, DEFAULT_THEME, THEME_PRESET_MAP, THEME_STORAGE_KEY, type ThemeColorKey } from './theme-config'
import { normalizePrefix } from '../utils/color-utils'
import { applyThemeToRoot } from './theme-applier'
import { readPersistedThemeState, writePersistedThemeState } from './theme-persistence'
import { resolveThemeVarMap, type IThemeVarMap } from './theme-resolver'
import type { IViThemeOptions } from '../types/theme'

/**
 * 对外暴露的主题运行时状态。
 */
export interface IThemeEngineState {
  /** 当前主题 key。 */
  themeKey: ThemeColorKey
  /** 当前暗黑模式状态。 */
  isDark: boolean
  /** 当前变量前缀。 */
  prefix: string
}

interface IInternalState extends IThemeEngineState {
  initialized: boolean
  defaultThemeKey: ThemeColorKey
  themeStorageKey: string
  darkStorageKey: string
  syncDefaultViPrefix: boolean
}

interface IConfigureResult {
  storageKeyChanged: boolean
}

/**
 * 主题引擎公共能力定义。
 */
export interface IThemeEngine {
  /** 初始化引擎并应用主题。 */
  init: (options?: IViThemeOptions) => void
  /** 重新应用当前主题并持久化。 */
  apply: () => void
  /** 仅从存储恢复后再应用主题。 */
  hydrate: () => void
  /** 切换主题 key。 */
  setTheme: (themeKey: ThemeColorKey) => void
  /** 设置暗黑模式。 */
  setDark: (dark: boolean) => void
  /** 反转暗黑模式。 */
  toggleDark: () => void
  /** 读取当前状态快照。 */
  getState: () => IThemeEngineState
  /** 订阅状态变化并返回取消订阅函数。 */
  subscribe: (listener: (state: IThemeEngineState) => void) => () => void
}

type ThemeListener = (state: IThemeEngineState) => void

const state: IInternalState = {
  themeKey: DEFAULT_THEME,
  isDark: false,
  prefix: 'vi',
  initialized: false,
  defaultThemeKey: DEFAULT_THEME,
  themeStorageKey: THEME_STORAGE_KEY,
  darkStorageKey: DARK_STORAGE_KEY,
  syncDefaultViPrefix: true,
}

const listeners = new Set<ThemeListener>()

function notify(): void {
  const snapshot = getThemeStateSnapshot()
  for (const listener of listeners) {
    listener(snapshot)
  }
}

function getThemeStateSnapshot(): IThemeEngineState {
  return {
    themeKey: state.themeKey,
    isDark: state.isDark,
    prefix: state.prefix,
  }
}

function configure(options?: IViThemeOptions): IConfigureResult {
  if (!options) {
    return {
      storageKeyChanged: false,
    }
  }

  let storageKeyChanged = false

  // defaultThemeKey 仅作为“无持久化值”时的回退初始值。
  if (options.defaultThemeKey && THEME_PRESET_MAP[options.defaultThemeKey]) {
    state.defaultThemeKey = options.defaultThemeKey
  }

  if (options.prefix) {
    state.prefix = normalizePrefix(options.prefix)
  }

  if (options.themeStorageKey && options.themeStorageKey !== state.themeStorageKey) {
    state.themeStorageKey = options.themeStorageKey
    storageKeyChanged = true
  }

  if (options.darkStorageKey && options.darkStorageKey !== state.darkStorageKey) {
    state.darkStorageKey = options.darkStorageKey
    storageKeyChanged = true
  }

  if (typeof options.syncDefaultViPrefix === 'boolean') {
    state.syncDefaultViPrefix = options.syncDefaultViPrefix
  }

  return {
    storageKeyChanged,
  }
}

function hydrateStateFromStorage(): void {
  const persisted = readPersistedThemeState(state.themeStorageKey, state.darkStorageKey, state.defaultThemeKey)

  state.themeKey = THEME_PRESET_MAP[persisted.themeKey as ThemeColorKey]
    ? (persisted.themeKey as ThemeColorKey)
    : state.defaultThemeKey
  state.isDark = persisted.isDark
}

function persistState(): void {
  writePersistedThemeState(state.themeStorageKey, state.darkStorageKey, {
    themeKey: state.themeKey,
    isDark: state.isDark,
  })
}

function buildVarMaps(): IThemeVarMap[] {
  const maps: IThemeVarMap[] = []

  const defaultMap = resolveThemeVarMap('vi', state.themeKey, state.isDark)
  const customMap = state.prefix === 'vi' ? undefined : resolveThemeVarMap(state.prefix, state.themeKey, state.isDark)

  // 默认前缀场景只输出一套变量，避免重复写入。
  if (state.prefix === 'vi') {
    maps.push(defaultMap)
    return maps
  }

  // 自定义前缀场景按配置决定是否保留 --vi-* 兼容输出。
  if (state.syncDefaultViPrefix) {
    maps.push(defaultMap)
  }

  if (customMap) {
    maps.push(customMap)
  }

  return maps
}

function applyThemeInternal(): void {
  applyThemeToRoot({
    themeKey: state.themeKey,
    prefix: state.prefix,
    isDark: state.isDark,
    varMaps: buildVarMaps(),
  })
}

function commit(): void {
  applyThemeInternal()
  persistState()
  notify()
}

function init(options?: IViThemeOptions): void {
  const configureResult = configure(options)

  // 首次初始化或存储键变更时，重新按当前配置读取持久化状态。
  if (!state.initialized || configureResult.storageKeyChanged) {
    hydrateStateFromStorage()
    state.initialized = true
  }

  commit()
}

function apply(): void {
  if (!state.initialized) {
    init()
    return
  }

  commit()
}

function hydrate(): void {
  hydrateStateFromStorage()
  state.initialized = true
  commit()
}

function setTheme(themeKey: ThemeColorKey): void {
  if (!THEME_PRESET_MAP[themeKey]) return
  if (state.themeKey === themeKey) return

  state.themeKey = themeKey
  commit()
}

function setDark(dark: boolean): void {
  if (state.isDark === dark) return

  state.isDark = dark
  commit()
}

function toggleDark(): void {
  state.isDark = !state.isDark
  commit()
}

function getState(): IThemeEngineState {
  return getThemeStateSnapshot()
}

function subscribe(listener: ThemeListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const engine: IThemeEngine = {
  init,
  apply,
  hydrate,
  setTheme,
  setDark,
  toggleDark,
  getState,
  subscribe,
}

/**
 * 获取全局单例主题引擎。
 */
export function getViThemeEngine(): IThemeEngine {
  return engine
}
