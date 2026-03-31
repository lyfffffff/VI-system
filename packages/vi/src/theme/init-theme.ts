import type { IViThemeOptions } from '../types/theme'
import { useViTheme } from '../composables/use-vi-theme'

export function initViTheme(options?: IViThemeOptions): void {
  const { applyTheme } = useViTheme(options)
  applyTheme()
}
