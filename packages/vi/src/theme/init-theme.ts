// 主题初始化入口：作为唯一配置入口初始化全局单例主题引擎。
import type { IViThemeOptions } from '../types/theme'
import { getViThemeEngine } from './theme-engine'

/**
 * 在应用启动时初始化主题状态并注入主题变量。
 * @param options 主题初始化配置（初始主题、存储 key 等）。
 * @returns 无返回值。
 */
export function initViTheme(options?: IViThemeOptions): void {
  getViThemeEngine().init(options)
}
