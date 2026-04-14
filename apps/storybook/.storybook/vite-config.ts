/**
 * Storybook 的 Vite 配置
 * 包含 VI 库别名、插件、文件访问权限等配置
 */

import vue from "@vitejs/plugin-vue";
import type { InlineConfig, PluginOption } from "vite";
import {
  viDistEntry,
  viDistStylesEntry,
  viSourceEntry,
  viSourceStylesEntry,
  storybookAppRoot,
  viPackageRoot,
} from "./path";

/**
 * 是否为源码模式
 * - true: 读取 VI 库源码，支持热更新
 * - false: 读取 VI 库构建产物，验证打包效果
 *
 * @default true - 默认使用源码模式，只有显式设置 VI_SOURCE_MODE=false 时才切换为构建模式
 */
const isSourceMode = process.env.VI_SOURCE_MODE !== "false";

/**
 * VI 库的 Vite 别名配置
 * 根据模式自动切换源码/构建产物
 */
const VI_DEV_ALIASES = [
  {
    find: "@yyxxfe/vi/styles",
    replacement: isSourceMode ? viSourceStylesEntry : viDistStylesEntry,
  },
  {
    find: "@yyxxfe/vi",
    replacement: isSourceMode ? viSourceEntry : viDistEntry,
  },
] as const;

/**
 * 配置 Vite 别名
 *
 * 将 VI 库的别名配置合并到现有别名中，支持数组和对象两种形式
 *
 * @param viteConfig - Vite 配置对象
 * @returns 配置别名后的 Vite 配置对象
 */
function configureAlias(viteConfig: InlineConfig): InlineConfig {
  viteConfig.resolve = viteConfig.resolve ?? {};
  const existing = viteConfig.resolve.alias;

  if (Array.isArray(existing)) {
    viteConfig.resolve.alias = [...VI_DEV_ALIASES, ...existing];
  } else if (existing && typeof existing === "object") {
    viteConfig.resolve.alias = [
      ...VI_DEV_ALIASES,
      ...Object.entries(existing).map(([find, replacement]) => ({
        find,
        replacement: replacement as string,
      })),
    ];
  } else {
    viteConfig.resolve.alias = [...VI_DEV_ALIASES];
  }

  return viteConfig;
}

/**
 * 配置 Vite 插件
 *
 * 添加 Vue 插件到现有插件列表中
 *
 * @param viteConfig - Vite 配置对象
 * @returns 配置插件后的 Vite 配置对象
 */
function configurePlugins(viteConfig: InlineConfig): InlineConfig {
  viteConfig.plugins = [
    ...(viteConfig.plugins ?? []),
    vue() as PluginOption,
  ];
  return viteConfig;
}

/**
 * 配置 Vite 开发服务器的文件访问权限
 *
 * 源码模式需要访问 VI 源码目录以支持热更新，
 * 构建模式只需访问 Storybook 应用和构建产物
 *
 * @param viteConfig - Vite 配置对象
 * @returns 配置文件访问权限后的 Vite 配置对象
 */
function configureFileAccess(viteConfig: InlineConfig): InlineConfig {
  const prevAllow = viteConfig.server?.fs?.allow ?? [];
  viteConfig.server = viteConfig.server ?? {};

  viteConfig.server.fs = {
    ...viteConfig.server.fs,
    allow: isSourceMode
      ? [...prevAllow, storybookAppRoot, viPackageRoot]
      : [...prevAllow, storybookAppRoot],
  };

  return viteConfig;
}

/**
 * 创建最终的 Vite 配置
 *
 * 按顺序应用：别名配置 → 插件配置 → 文件访问权限配置
 *
 * @param viteConfig - 原始 Vite 配置对象
 * @returns 完整配置后的 Vite 配置对象
 */
export function createViteFinalConfig(viteConfig: InlineConfig): InlineConfig {
  return configureFileAccess(configurePlugins(configureAlias(viteConfig)));
}
