## ADDED Requirements

### Requirement: 组件文档主入口采用 Storybook
系统 MUST 提供基于 Storybook 的组件文档与预览入口，并 SHALL 支持本地开发与静态构建。

#### Scenario: 本地开发入口
- **WHEN** 开发者执行 `pnpm dev:storybook`
- **THEN** 系统 MUST 启动 Storybook 本地服务
- **AND** 开发者 MUST 能在浏览器访问组件文档首页

#### Scenario: 静态文档构建
- **WHEN** 开发者执行 `pnpm build:storybook`
- **THEN** 系统 MUST 产出可部署的静态文档站点
- **AND** 构建过程 MUST 可在 CI 环境稳定执行

### Requirement: ThemeDrawer 文档输出完整
系统 MUST 在 Storybook 文档中完整输出 ThemeDrawer 的接入契约，至少包含 Props、回调钩子与示例代码。

#### Scenario: Props 文档可用
- **WHEN** 开发者查看 ThemeDrawer 文档页
- **THEN** 文档 MUST 包含每个 Prop 的名称、类型、默认值与说明
- **AND** 文档 MUST 覆盖 `open`、`placement`、`themes`

#### Scenario: 回调钩子文档可用
- **WHEN** 开发者查看 ThemeDrawer 文档页
- **THEN** 文档 MUST 明确 `update:open`、`theme-change`、`mode-change` 的触发时机
- **AND** 文档 MUST 给出事件参数签名与监听示例

### Requirement: 主题能力在文档库中可真实演示
系统 MUST 在 Storybook 中复用 VI 主题初始化与状态管理能力，确保示例行为与业务接入一致。

#### Scenario: 主题抽屉示例演示
- **WHEN** 开发者打开 `Theme/Theme Drawer` 示例
- **THEN** 示例 MUST 支持 17 主题切换与浅/暗模式切换
- **AND** 主题切换效果 MUST 与业务项目一致

#### Scenario: 全局初始化一致性
- **WHEN** Storybook 渲染任一依赖主题变量的组件
- **THEN** 系统 MUST 已完成 Element Plus 与 `initViTheme()` 初始化
- **AND** 组件 MUST 可读取到正确的语义变量与映射变量

### Requirement: 移除 Histoire 预览入口
系统 MUST 在切换到 Storybook 后移除 Histoire 预览入口，避免双入口并存。

#### Scenario: 入口清理完成
- **WHEN** 开发者在仓库中检查预览入口
- **THEN** 系统 MUST 不再提供 `dev:histoire`、`build:histoire`、`preview:histoire` 脚本
- **AND** `apps/histoire` 目录 MUST 已移除
