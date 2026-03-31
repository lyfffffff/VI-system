## Why

当前仓库已接入 Histoire 作为预览入口，但从团队协作与组件文档建设角度，Storybook 在生态、文档能力（Autodocs/MDX）、测试扩展（interaction/test-runner）和对外发布流程上更贴近后续目标。  
为避免双入口长期并存带来的维护成本，本次变更明确采用 Storybook 作为唯一文档预览入口，并下线 Histoire。

### 背景
- 现状：`apps/histoire` 已可运行并提供基础预览能力。
- 问题：双入口会增加维护成本，且 Histoire 与后续文档标准化产出路径不一致。
- 机会：在 VI 系统规模尚小阶段完成切换，迁移成本可控。

### 目标
- 引入 Storybook 作为 VI 系统唯一文档库与预览入口。
- 迁移主题抽屉示例并补齐 API 文档（Props + 回调钩子）。
- 建立统一的本地开发与静态构建命令，支撑后续 CI/CD 发布。

### 范围
- 包含：Storybook 工程接入、全局预览初始化、主题抽屉示例迁移、文档构建命令。
- 包含：ThemeDrawer 的完整文档输出（Props、事件回调、接入示例）。
- 包含：移除 Histoire 目录、脚本、依赖与文档引用。

### 非目标
- 不在本次变更中删除 VI 主题功能代码。
- 不在本次变更中完成全部组件文档覆盖。
- 不在本次变更中引入视觉回归平台（如 Chromatic）强依赖。

### 验收标准
- `pnpm dev:storybook` 可正常启动，且可访问主题抽屉示例。
- `pnpm build:storybook` 可输出静态站点。
- Storybook 中可演示 17 主题切换与浅/暗模式切换。
- 文档中提供 ThemeDrawer 完整 API（Props、回调钩子、参数签名、示例）。
- 仓库中移除 Histoire 的运行入口与业务文档引用（归档目录除外）。

## What Changes

- 新增 OpenSpec change：`adopt-storybook-docs`。
- 新增 `apps/storybook`（或等效目录）作为文档与预览入口。
- 迁移现有 `theme-drawer` 预览到 Storybook（CSF/Autodocs）。
- 增加 Storybook 全局初始化：Element Plus、`@yyxxfe/vi` 主题初始化。
- 输出 ThemeDrawer API 文档（Props、回调钩子、接入示例）。
- 移除 Histoire 目录、脚本、依赖与文档引用。

## Capabilities

### New Capabilities
- `component-docs`: 提供基于 Storybook 的组件文档、交互预览与静态构建能力。

### Modified Capabilities
- `theme-system`: 主题能力的预览承载方式切换为 Storybook 主入口。

## Impact

- **受影响代码**
  - 根工作区脚本与依赖（`package.json`、lockfile）。
  - 新增 Storybook 配置目录（`.storybook` 或 `apps/storybook`）。
  - 现有 `apps/histoire/src/stories/theme-drawer.story.vue` 的迁移版本。
  - 文档文件（`docs/guides/*`）中的启动与 API 说明。
- **受影响系统**
  - 开发预览入口
  - 文档站点构建流程
- **依赖影响**
  - 新增 Storybook 相关依赖（`@storybook/vue3-vite` 等）
  - 移除 Histoire 相关依赖
