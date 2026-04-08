// 主题状态主入口：消费全局单例主题引擎，提供响应式状态与操作 API。
import { computed, ref } from 'vue'
import { THEME_PRESET_MAP, type ThemeColorKey } from '../theme/theme-config'
import type { ComputedRef, Ref } from 'vue'
import type { IThemePreset } from '../types/theme'
import { getViThemeEngine } from '../theme/theme-engine'

interface IUseViThemeResult {
  /** @description 当前主题 key 响应式引用。 */
  themeKey: Ref<ThemeColorKey>
  /** @description 当前暗黑模式状态响应式引用。 */
  isDark: Ref<boolean>
  /** @description 当前主题预设的计算属性。 */
  currentTheme: ComputedRef<IThemePreset<ThemeColorKey>>
  /**
   * @description 切换主题 key。
   * @param themeKey 目标主题 key。
   * @returns 无返回值。
   */
  setTheme: (themeKey: ThemeColorKey) => void
  /**
   * @description 设置暗黑模式状态。
   * @param dark 目标暗黑状态。
   * @returns 无返回值。
   */
  setDark: (dark: boolean) => void
  /**
   * @description 反转当前暗黑状态。
   * @returns 无返回值。
   */
  toggleDark: () => void
  /**
   * @description 立即应用主题并写入本地存储。
   * @returns 无返回值。
   */
  applyTheme: () => void
}

const themeEngine = getViThemeEngine()
const themeKeyRef = ref<ThemeColorKey>(themeEngine.getState().themeKey)
const isDarkRef = ref<boolean>(themeEngine.getState().isDark)

let subscribed = false

/**
 * 同步主题引擎状态到响应式引用。
 */
function syncStateFromEngine(): void {
  const nextState = themeEngine.getState()
  themeKeyRef.value = nextState.themeKey
  isDarkRef.value = nextState.isDark
}

/**
 * 绑定主题引擎订阅。
 */
function bindEngineSubscription(): void {
  if (subscribed) return

  themeEngine.subscribe((nextState) => {
    themeKeyRef.value = nextState.themeKey
    isDarkRef.value = nextState.isDark
  })

  subscribed = true
}

/**
 * 主题状态主 composable：提供主题 key、暗黑状态和主题切换方法。
 * @returns 主题状态与操作方法集合。
 */
export function useViTheme(): IUseViThemeResult {
  themeEngine.init()
  bindEngineSubscription()
  syncStateFromEngine()

  const currentTheme = computed(() => THEME_PRESET_MAP[themeKeyRef.value])

  function setTheme(themeKey: ThemeColorKey): void {
    themeEngine.setTheme(themeKey)
  }

  function setDark(dark: boolean): void {
    themeEngine.setDark(dark)
  }

  function toggleDark(): void {
    themeEngine.toggleDark()
  }

  function applyTheme(): void {
    themeEngine.apply()
  }

  return {
    themeKey: themeKeyRef,
    isDark: isDarkRef,
    currentTheme,
    setTheme,
    setDark,
    toggleDark,
    applyTheme,
  }
}
