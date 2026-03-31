import { computed, ref, watch } from 'vue'
import { DARK_STORAGE_KEY, DEFAULT_THEME, THEME_PRESET_MAP, THEME_STORAGE_KEY, type ThemeColorKey } from '../theme/theme-config'
import type { IViThemeOptions } from '../types/theme'
import { createVarName, generatePageBackground, getThemeVariants, normalizePrefix } from '../utils/color-utils'

interface IConfigureResult {
  prefixChanged: boolean
  storageKeyChanged: boolean
}

const state = {
  prefix: 'vi',
  themeStorageKey: THEME_STORAGE_KEY,
  darkStorageKey: DARK_STORAGE_KEY,
  initialized: false,
  watcherBound: false,
  themeKey: ref<ThemeColorKey>(DEFAULT_THEME),
  isDark: ref(false),
}

function hasWindow(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function readStorage<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (!hasWindow()) return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 忽略浏览器禁用存储等异常
  }
}

function persistState(): void {
  writeStorage(state.themeStorageKey, state.themeKey.value)
  writeStorage(state.darkStorageKey, state.isDark.value)
}

function configure(options?: IViThemeOptions): IConfigureResult {
  if (!options) {
    return {
      prefixChanged: false,
      storageKeyChanged: false,
    }
  }

  let prefixChanged = false
  let storageKeyChanged = false

  if (options.prefix) {
    const nextPrefix = normalizePrefix(options.prefix)
    if (nextPrefix !== state.prefix) {
      state.prefix = nextPrefix
      prefixChanged = true
    }
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
    prefixChanged,
    storageKeyChanged,
  }
}

function initStateFromStorage(): void {
  const storedTheme = readStorage<ThemeColorKey>(state.themeStorageKey, DEFAULT_THEME)
  const storedDark = readStorage<boolean>(state.darkStorageKey, false)

  state.themeKey.value = THEME_PRESET_MAP[storedTheme] ? storedTheme : DEFAULT_THEME
  state.isDark.value = storedDark
}

function setVar(name: string, value: string): void {
  if (!hasWindow()) return
  document.documentElement.style.setProperty(name, value)
}

function applySemanticVarsForPrefix(prefix: string, themeKey: ThemeColorKey, isDark: boolean): void {
  const preset = THEME_PRESET_MAP[themeKey]
  const variants = getThemeVariants(preset.hex)

  const surfaceBody = isDark ? '#111214' : '#f4f7fc'
  const surfacePanel = isDark ? '#1d1e1f' : '#ffffff'
  const surfacePanelMuted = isDark ? '#232425' : '#f8fafd'
  const surfaceOverlay = isDark ? 'rgba(20, 28, 32, 0.96)' : 'rgba(248, 250, 252, 0.96)'

  const textPrimary = isDark ? '#e5eaf3' : '#23345f'
  const textSecondary = isDark ? '#b7c0d0' : '#52607a'
  const textMuted = isDark ? '#98a2b3' : '#7d8799'
  const textDisabled = isDark ? '#7f8797' : '#a6adbb'

  const borderDefault = isDark ? '#363637' : '#dfe5ef'
  const borderLight = isDark ? '#2f3134' : '#edf2f7'
  const borderStrong = isDark ? '#4b4e53' : '#c7d0dd'

  const fillSoft = isDark ? '#242629' : '#f3f6fb'
  const fillMuted = isDark ? '#2f3237' : '#e9eff7'

  const focusRing = `rgba(${preset.rgb}, 0.26)`
  const sidebarActive = `rgba(${preset.rgb}, ${isDark ? '0.22' : '0.14'})`
  const sidebarHover = `rgba(${preset.rgb}, ${isDark ? '0.14' : '0.06'})`
  const tagBg = `rgba(${preset.rgb}, ${isDark ? '0.2' : '0.1'})`
  const tagBorder = `rgba(${preset.rgb}, ${isDark ? '0.32' : '0.16'})`

  const pageBg = generatePageBackground(preset.rgb, isDark, themeKey)

  setVar(createVarName(prefix, 'color-primary'), preset.hex)
  setVar(createVarName(prefix, 'color-primary-rgb'), preset.rgb)
  setVar(createVarName(prefix, 'color-primary-light-3'), variants.light3)
  setVar(createVarName(prefix, 'color-primary-light-5'), variants.light5)
  setVar(createVarName(prefix, 'color-primary-light-7'), variants.light7)
  setVar(createVarName(prefix, 'color-primary-light-8'), variants.light8)
  setVar(createVarName(prefix, 'color-primary-light-9'), variants.light9)
  setVar(createVarName(prefix, 'color-primary-dark-2'), variants.dark2)

  setVar(createVarName(prefix, 'page-bg'), pageBg)
  setVar(createVarName(prefix, 'surface-body'), surfaceBody)
  setVar(createVarName(prefix, 'surface-panel'), surfacePanel)
  setVar(createVarName(prefix, 'surface-panel-muted'), surfacePanelMuted)
  setVar(createVarName(prefix, 'surface-overlay'), surfaceOverlay)

  setVar(createVarName(prefix, 'text-primary'), textPrimary)
  setVar(createVarName(prefix, 'text-secondary'), textSecondary)
  setVar(createVarName(prefix, 'text-muted'), textMuted)
  setVar(createVarName(prefix, 'text-disabled'), textDisabled)

  setVar(createVarName(prefix, 'border-default'), borderDefault)
  setVar(createVarName(prefix, 'border-light'), borderLight)
  setVar(createVarName(prefix, 'border-strong'), borderStrong)

  setVar(createVarName(prefix, 'fill-soft'), fillSoft)
  setVar(createVarName(prefix, 'fill-muted'), fillMuted)
  setVar(createVarName(prefix, 'focus-ring'), focusRing)

  setVar(createVarName(prefix, 'sidebar-item-active'), sidebarActive)
  setVar(createVarName(prefix, 'sidebar-item-hover'), sidebarHover)
  setVar(createVarName(prefix, 'tag-bg'), tagBg)
  setVar(createVarName(prefix, 'tag-border'), tagBorder)
  setVar(createVarName(prefix, 'tag-text'), preset.hex)

  setVar(createVarName(prefix, 'shadow-panel'), isDark ? '0 8px 24px rgba(0, 0, 0, 0.36)' : '0 6px 18px rgba(31, 42, 68, 0.04)')
  setVar(createVarName(prefix, 'shadow-popover'), isDark ? '0 12px 32px rgba(0, 0, 0, 0.38)' : '0 12px 32px rgba(15, 23, 42, 0.14)')
}

function applyThemeInternal(): void {
  if (!hasWindow()) return

  const root = document.documentElement

  // 样式层默认消费 --vi-*，同时把自定义前缀变量也写入，保证前缀扩展链路完整。
  applySemanticVarsForPrefix('vi', state.themeKey.value, state.isDark.value)
  if (state.prefix !== 'vi') {
    applySemanticVarsForPrefix(state.prefix, state.themeKey.value, state.isDark.value)
  }

  root.dataset.theme = state.themeKey.value
  root.dataset.viPrefix = state.prefix

  if (state.isDark.value) {
    root.classList.add('dark')
    return
  }

  root.classList.remove('dark')
}

function bindWatcher(): void {
  if (state.watcherBound) return

  watch([state.themeKey, state.isDark], () => {
    applyThemeInternal()
    persistState()
  })

  state.watcherBound = true
}

export function useViTheme(options?: IViThemeOptions) {
  const configState = configure(options)

  if (!state.initialized) {
    initStateFromStorage()
    applyThemeInternal()
    bindWatcher()
    state.initialized = true
  } else if (configState.storageKeyChanged) {
    initStateFromStorage()
    applyThemeInternal()
  } else if (configState.prefixChanged) {
    applyThemeInternal()
  }

  const currentTheme = computed(() => THEME_PRESET_MAP[state.themeKey.value])

  function setTheme(themeKey: ThemeColorKey): void {
    if (!THEME_PRESET_MAP[themeKey]) return
    state.themeKey.value = themeKey
  }

  function setDark(dark: boolean): void {
    state.isDark.value = dark
  }

  function toggleDark(): void {
    state.isDark.value = !state.isDark.value
  }

  function applyTheme(): void {
    applyThemeInternal()
    persistState()
  }

  return {
    themeKey: state.themeKey,
    isDark: state.isDark,
    currentTheme,
    setTheme,
    setDark,
    toggleDark,
    applyTheme,
  }
}
