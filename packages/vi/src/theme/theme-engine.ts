// 主题引擎：全局单例编排主题状态、变量注入与持久化。
import { DARK_STORAGE_KEY, DEFAULT_THEME, THEME_PRESET_MAP, THEME_STORAGE_KEY, type ThemeColorKey } from './theme-config'
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
}

interface IInternalState extends IThemeEngineState {
  initialized: boolean
  defaultThemeKey: ThemeColorKey
  themeStorageKey: string
  darkStorageKey: string
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

// 单例全局状态：应用内所有 useViTheme() 调用共享这一份状态。
const state: IInternalState = {
  themeKey: DEFAULT_THEME,
  isDark: false,
  initialized: false,
  defaultThemeKey: DEFAULT_THEME,
  themeStorageKey: THEME_STORAGE_KEY,
  darkStorageKey: DARK_STORAGE_KEY,
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
  }
}

// 仅处理配置项，不做注入；便于 init/apply/hydrate 复用同一配置入口。
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

  if (options.themeStorageKey && options.themeStorageKey !== state.themeStorageKey) {
    state.themeStorageKey = options.themeStorageKey
    storageKeyChanged = true
  }

  if (options.darkStorageKey && options.darkStorageKey !== state.darkStorageKey) {
    state.darkStorageKey = options.darkStorageKey
    storageKeyChanged = true
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

// 变量映射来源唯一：统一由 resolver 根据当前状态计算。
function buildVarMaps(): IThemeVarMap[] {
  return [resolveThemeVarMap(state.themeKey, state.isDark)]
}

function applyThemeInternal(): void {
  applyThemeToRoot({
    themeKey: state.themeKey,
    isDark: state.isDark,
    varMaps: buildVarMaps(),
  })
}

function commit(): void {
  // 提交顺序：先注入 -> 再持久化 -> 最后广播，避免订阅方读到旧 DOM。
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
