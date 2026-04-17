/**
 * Storybook 的 Vite 配置
 * 包含 VI 库别名、插件、文件访问权限等配置
 */

import vue from "@vitejs/plugin-vue";
import type { InlineConfig, PluginOption } from "vite";
import {
  viSourceEntry,
  viStylesEntry,
  viElementPlusEntry,
  viWorkbenchEntry,
  storybookAppRoot,
  viPackageRoot,
} from "./path";

const isDev = process.env.DOC_ENV !== "production";

/**
 * 根据DOC_ENV环境变量配置路径别名
 *
 * 开发模式（isDev=true）：用源码别名 + 允许访问 vi 源码目录 → 支持热更新
 * 生产模式（isDev=false）：不设别名 + 不需要 vi 源码访问 → 使用构建产物 dist
 */
const alias = [
  ...(isDev
    ? [
        // 注意：更具体的路径必须放在前面，否则会被 @yyxxfe/vi 先匹配
        {
          find: "@yyxxfe/vi/styles/element-plus",
          replacement: viElementPlusEntry,
        },
        {
          find: "@yyxxfe/vi/styles/workbench",
          replacement: viWorkbenchEntry,
        },
        {
          find: "@yyxxfe/vi/styles",
          replacement: viStylesEntry,
        },
        {
          find: "@yyxxfe/vi",
          replacement: viSourceEntry,
        },
      ]
    : []),
] as const;

/**
 * 创建最终的 Vite 配置
 *
 * 配置别名、插件和文件访问权限
 *
 * @param viteConfig - 原始 Vite 配置对象
 * @returns 完整配置后的 Vite 配置对象
 */
export async function createViteFinalConfig(
  viteConfig: InlineConfig
): Promise<InlineConfig> {
  const { mergeConfig } = await import("vite");
  const prevAllow = viteConfig.server?.fs?.allow ?? [];

  return mergeConfig(viteConfig, {
    resolve: {
      alias,
    },
    plugins: [vue() as PluginOption],
    server: {
      fs: {
        allow: isDev
          ? [...prevAllow, storybookAppRoot, viPackageRoot]
          : [...prevAllow, storybookAppRoot],
      },
    },
  });
}
