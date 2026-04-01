# theme-system Specification

## Purpose
TBD - created by archiving change add-vi-theme-drawer. Update Purpose after archive.
## Requirements
### Requirement: 主题预设与持久化
系统 MUST 提供固定 17 个预设主题，并 SHALL 在主题切换后持久化用户选择，支持刷新恢复。

#### Scenario: 首次访问默认主题
- **WHEN** 用户首次访问系统且本地无主题配置
- **THEN** 系统 MUST 使用默认主题 `teal`
- **AND** 系统 MUST 应用默认主题对应的颜色变量

#### Scenario: 刷新后恢复主题
- **WHEN** 用户已选择非默认主题并刷新页面
- **THEN** 系统 MUST 从本地存储恢复 `themeKey`
- **AND** 页面主题 MUST 与刷新前保持一致

### Requirement: 语义变量层与映射层
系统 MUST 采用“token -> 语义变量层（默认 `--vi-*`）-> `--el-*`/`--wb-*` 映射层 -> 组件覆盖层”的主题注入机制，组件 SHALL 不直接依赖品牌变量实现。

#### Scenario: 主题切换变量注入
- **WHEN** 用户从 `teal` 切换到 `blue`
- **THEN** 系统 MUST 先更新语义变量层
- **AND** 系统 MUST 同步更新 `--el-*` 与 `--wb-*` 映射变量
- **AND** 仅当映射层无法表达差异时，系统 MAY 进入覆盖层

#### Scenario: 业务覆盖语义变量
- **WHEN** 业务项目覆写语义变量层中的某个颜色变量
- **THEN** 系统 MUST 继续通过映射层驱动组件样式
- **AND** 不要求业务项目直接覆写 `--el-*`

#### Scenario: 前缀可配置链路完整
- **WHEN** 业务项目将主题前缀从默认值调整为自定义前缀
- **THEN** 语义变量、映射变量与运行时注入 MUST 同步生效
- **AND** 不得出现仅 TS 层生效而样式层失效的情况

### Requirement: 暗黑模式双层机制
系统 MUST 同时支持 CSS fallback 与 JS 运行时注入的暗黑模式机制，并 SHALL 明确以 `html.dark` 作为暗黑状态基准。

#### Scenario: 暗黑模式切换
- **WHEN** 用户在主题抽屉中切换到暗黑模式
- **THEN** 系统 MUST 设置暗黑状态并更新变量
- **AND** 系统 MUST 切换 `html.dark` 状态
- **AND** 页面不应出现明显闪烁

#### Scenario: 暗黑模式下组件一致性
- **WHEN** 页面处于暗黑模式且用户切换主题色
- **THEN** Element Plus 组件与 Workbench 组件 MUST 维持一致的暗黑视觉基线
- **AND** 主题色变化 MUST 仅改变强调色，不得破坏暗黑对比度

### Requirement: 主题抽屉交互能力
系统 MUST 提供右侧主题抽屉组件，支持 17 主题选择与浅/暗模式切换；抽屉 SHALL 提供标准组件事件用于外部接入。

#### Scenario: 打开并切换主题
- **WHEN** 外部页面打开主题抽屉并选择任一预设主题
- **THEN** 主题抽屉 MUST 触发主题变更流程
- **AND** 系统 MUST 即时更新全局主题

#### Scenario: 抽屉事件输出
- **WHEN** 抽屉打开状态、主题或模式发生变化
- **THEN** 组件 MUST 输出对应事件：`update:open`、`theme-change`、`mode-change`
- **AND** 事件参数 MUST 与类型定义保持一致

### Requirement: 基于 ad-center 的二次开发迁移
系统 MUST 以 `ad-center-web-source` 的主题实现作为迁移基线，并 SHALL 将项目内实现重构为 VI 库分层能力。

#### Scenario: 迁移来源一致性
- **WHEN** 执行本次变更的迁移任务
- **THEN** 主题配置、主题算法、主题状态管理、主题抽屉 MUST 以 ad-center 对应实现为基础进行迁移
- **AND** 迁移后代码 MUST 满足 VI 库命名与分层规范

### Requirement: V1 排除水印能力
系统 MUST 在 V1 阶段排除所有水印相关功能，不得在主题抽屉或主题能力层中引入水印状态与控制逻辑。

#### Scenario: V1 功能边界检查
- **WHEN** 完成 V1 主题系统开发并进行验收
- **THEN** 主题抽屉 MUST 仅包含“模式设置”和“主题颜色”能力
- **AND** V1 代码与文档 MUST 不包含水印控制项

