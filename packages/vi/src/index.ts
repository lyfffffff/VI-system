// VI 库主入口：主题能力与组件导出。

// 第一层：基础令牌，注入 --vi-* 变量
import './styles/index.less';

// 组件样式：聚合到主入口，用户只需导入 @yyxxfe/vi/styles
import './components/theme-drawer/index.less';

export { initViTheme } from "./theme/init-theme";
export { useViTheme } from "./composables/use-vi-theme";
export { THEME_PRESETS, DEFAULT_THEME } from "./theme/theme-config";
export { getThemeVariants } from "./utils/color-utils";
export type {
  ThemeColorKey,
  IThemePreset,
  IThemeVariants,
  IViThemeOptions,
  IViThemeState,
} from "./types/theme";

export { default as ThemeDrawer } from "./components/theme-drawer";
