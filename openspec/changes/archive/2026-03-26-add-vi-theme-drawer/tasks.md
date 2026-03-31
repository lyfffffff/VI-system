## 1. 主题配置与类型迁移

- [x] 1.1 将 `F:\web_git_frontend\ad-center-web-source\src\config\theme.config.ts` 迁移为 `packages/vi/src/theme/theme-config.ts`，保留 17 个预设主题。
- [x] 1.2 将 `src/types/theme.ts` 迁移为 `packages/vi/src/types/theme.ts`，统一接口命名为 `I` 前缀（如 `IThemePreset`、`IThemeState`）。
- [x] 1.3 将主题存储 key 从项目私有命名改为 VI 库级常量，并支持外部覆盖。

## 2. 主题工具函数迁移

- [x] 2.1 将 `F:\web_git_frontend\ad-center-web-source\src\utils\colorUtils.ts` 迁移为 `packages/vi/src/utils/color-utils.ts`（连字符命名）。
- [x] 2.2 保留并重构 `generatePageBackground` 与主题色变体生成逻辑，输出适配语义变量层（默认 `--vi-*`）。
- [x] 2.3 去除工具层中的业务耦合与页面私有常量，保留库级可复用实现。

## 3. 主题能力层迁移

- [x] 3.1 将 `F:\web_git_frontend\ad-center-web-source\src\composables\useThemeColor.ts` 迁移为 `packages/vi/src/composables/use-vi-theme.ts`。
- [x] 3.2 对外 API 收敛为 `themeKey`、`isDark`、`setTheme`、`toggleDark`、`applyTheme`。
- [x] 3.3 调整主题注入顺序为“语义变量层 -> `--el-*`/`--wb-*` 映射层”，禁止组件直接依赖品牌变量。
- [x] 3.4 抽离启动初始化逻辑到 `packages/vi/src/theme/init-theme.ts`，用于业务项目 `main.ts` 接入。

## 4. 主题抽屉组件迁移

- [x] 4.1 将 `F:\web_git_frontend\ad-center-web-source\src\components\theme\theme-drawer.vue` 迁移到 `packages/vi/src/components/theme-drawer/theme-drawer.vue`。
- [x] 4.2 组件保持 `script setup + ts`，并按项目规范完善 `Props`、`Emits`、注释与类型。
- [x] 4.3 保留功能：浅/暗模式切换、17 主题色切换、右侧抽屉交互。
- [x] 4.4 移除水印相关 import、状态、UI 区块与事件。
- [x] 4.5 将对外能力改为 `v-model:open`，并输出 `update:open`、`theme-change`、`mode-change`。
- [x] 4.6 新增 `packages/vi/src/components/theme-drawer/index.ts` 统一导出组件。

## 5. 全局样式拆分与映射重构

- [x] 5.1 将 `F:\web_git_frontend\ad-center-web-source\src\styles\theme.less` 按职责拆分为 token、语义变量、Element Plus 映射、Workbench 映射文件。
- [x] 5.2 清理样式中的主题硬编码，统一替换为语义变量层引用。
- [x] 5.3 保留暗黑模式 CSS fallback，并确保 JS 注入可覆盖 fallback。
- [x] 5.4 从 `history-nav.vue` 提炼可复用变量化样式到库级覆盖文件，禁止迁移业务结构样式。

## 6. 文档与接入说明

- [x] 6.1 将 `F:\web_git_frontend\ad-center-web-source\THEME_DRAWER_README.md` 重写为 VI 库接入文档，输出到 `docs/guides/theme-drawer.md`。
- [x] 6.2 新增 `docs/guides/theme-drawer-integration.md`，沉淀 `main.ts` 初始化与页面入口接入方式。
- [x] 6.3 文档统一使用简体中文，术语与代码命名保持一致。

## 7. OpenSpec 规格补齐

- [x] 7.1 在 `openspec/changes/add-vi-theme-drawer/` 下补齐 `proposal.md`、`design.md`。
- [x] 7.2 新增 `specs/theme-system/spec.md`，将主题抽屉、主题引擎、变量映射要求写成规范场景。
- [x] 7.3 删除/不写任何水印相关 Requirement，明确 V1 不包含水印能力。

## 8. V1 排除项核对（必须）

- [x] 8.1 明确不迁移 `src/composables/useWatermark.ts`。
- [x] 8.2 明确不迁移 `src/components/watermark/watermark.vue`。
- [x] 8.3 明确不迁移 `app.vue` 中的水印集成逻辑。
- [x] 8.4 代码评审时核对无水印 API、无水印 UI、无水印文档残留。

## 9. Histoire 预览入口

- [x] 9.1 新增根工作区配置（`package.json`、`pnpm-workspace.yaml`）与 Histoire 启动脚本。
- [x] 9.2 新增 `apps/histoire` 预览应用，完成 Histoire + Vue + Element Plus 基础配置。
- [x] 9.3 新增 `theme-drawer.story.vue`，可交互预览主题抽屉、主题色与明暗模式切换。
- [x] 9.4 补充接入文档中的本地预览步骤（`pnpm install` / `pnpm dev:histoire`）。
- [x] 9.5 执行 `pnpm build:histoire` 验证构建可通过。
