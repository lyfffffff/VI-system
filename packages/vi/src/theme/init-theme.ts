// 主题初始化入口：在应用启动时恢复存储状态并注入变量。
import type { IViThemeOptions } from '../types/theme'
import { useViTheme } from '../composables/use-vi-theme'

/**
 * 在应用启动时初始化主题状态并注入主题变量。
 * @param options 主题初始化配置（前缀、存储 key 等）。
 * @returns 无返回值。
 */
export function initViTheme(options?: IViThemeOptions): void {
  const { applyTheme } = useViTheme(options)
  applyTheme()
}
