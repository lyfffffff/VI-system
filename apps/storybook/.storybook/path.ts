/**
 * Storybook 路径常量定义
 * 集中管理项目各目录的绝对路径，避免硬编码重复
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Storybook 配置文件所在目录的绝对路径
 */
export const storybookDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Storybook 应用根目录的绝对路径
 */
export const storybookAppRoot = path.resolve(storybookDir, "..");

/**
 * 仓库根目录的绝对路径
 */
export const repoRoot = path.resolve(storybookDir, "../../..");

/**
 * VI 包根目录的绝对路径
 */
export const viPackageRoot = path.join(repoRoot, "packages/vi");

/**
 * VI 库源码入口文件路径（源码模式）
 */
export const viSourceEntry = path.join(viPackageRoot, "src/index.ts");

/**
 * VI 库构建入口文件路径（构建模式）
 */
export const viDistEntry = path.join(viPackageRoot, "dist/index.js");

/**
 * VI 库源码样式入口文件路径（源码模式）
 */
export const viSourceStylesEntry = path.join(viPackageRoot, "src/index.ts");

/**
 * VI 库构建样式文件路径（构建模式）
 */
export const viDistStylesEntry = path.join(viPackageRoot, "dist/style.css");
