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
 * VI 库 JS 主入口文件路径（源码模式）
 */
export const viSourceEntry = path.join(viPackageRoot, "src/index.ts");

/**
 * VI 库通用样式入口文件路径（源码模式，.less 文件）
 */
export const viStylesEntry = path.join(viPackageRoot, "src/styles/index.less");

/**
 * VI 库 Element Plus 样式入口文件路径（源码模式）
 */
export const viElementPlusEntry = path.join(viPackageRoot, "src/element-plus.ts");

/**
 * VI 库 Workbench 样式入口文件路径（源码模式）
 */
export const viWorkbenchEntry = path.join(viPackageRoot, "src/workbench.ts");
