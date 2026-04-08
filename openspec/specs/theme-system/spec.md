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

### Requirement: Element Plus 组件主题改造优先级
系统 MUST 对基础组件样式改造执行固定优先级：`CSS var` > `业务 class` > `直接覆盖组件内部样式`，并 SHALL 将直接覆盖限制为兜底手段。

#### Scenario: 变量可满足需求
- **WHEN** 某组件样式差异可通过语义变量与映射变量表达
- **THEN** 实现 MUST 仅修改变量层，不得新增组件内部样式覆盖

#### Scenario: 变量无法满足需求
- **WHEN** 某视觉差异无法由变量层表达（如拼接圆角、结构性状态样式）
- **THEN** 实现 MAY 在业务 class 作用域增加覆盖
- **AND** 若仍不足才 MAY 使用组件内部样式覆盖作为兜底

### Requirement: 业务局部主题覆盖优先级
系统 MUST 支持业务局部作用域覆盖语义变量，且 SHALL 保证局部覆盖优先于全局默认主题，不影响作用域外页面。

#### Scenario: 页面局部覆盖生效
- **WHEN** 业务页面在局部容器内覆写语义变量（例如 `--*-color-primary`）
- **THEN** 该容器内组件 MUST 使用局部变量渲染
- **AND** 容器外组件 MUST 继续使用全局主题变量

#### Scenario: 局部未定义变量回退
- **WHEN** 局部容器仅覆写部分语义变量
- **THEN** 未覆写变量 MUST 回退到全局主题值

### Requirement: 覆盖样式文件按组件拆分
系统 MUST 将主题覆盖样式按组件职责拆分并统一聚合引入，以降低改动影响面并提升可维护性。

#### Scenario: 新增组件覆盖
- **WHEN** 需要新增某组件（如 table、drawer）的覆盖规则
- **THEN** 规则 MUST 写入对应组件覆盖文件
- **AND** 聚合入口 MUST 保持稳定引入顺序

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

### Requirement: ELP 覆盖作用域分层
系统 MUST 在覆盖层区分“全局覆盖”与“作用域覆盖”，并 SHALL 采用固定选择器策略：全局覆盖直接使用 `.el-*`，作用域覆盖仅允许在 `.vi-theme-scope` 下声明。

#### Scenario: 全局覆盖规则落位
- **WHEN** 某规则用于修正 Element Plus 默认样式与原型规范的通用差异（与业务容器无关）
- **THEN** 该规则 MUST 直接使用全局 `.el-*` 选择器
- **AND** 该规则 MUST NOT 放入 `.vi-theme-scope` 作用域容器

#### Scenario: 作用域覆盖规则落位
- **WHEN** 某规则依赖业务结构或业务 class（如拼接输入、快捷分段按钮）
- **THEN** 该规则 MUST 仅在 `.vi-theme-scope` 下声明
- **AND** 该规则 MUST NOT 直接作为全局 `.el-*` 覆盖

### Requirement: ELP 覆盖最小差异集
系统 MUST 将 `packages/vi/src/styles/element-ui/*.less` 与 `packages/vi/src/styles/workbench/*.less` 收敛为“仅保留 ELP 默认样式与原型差异”的最小覆盖集。

#### Scenario: 冗余覆盖清理
- **WHEN** 某覆盖规则与映射层变量能力重复，或不构成 ELP 与原型差异
- **THEN** 该规则 MUST 从覆盖层组件文件中移除

#### Scenario: 差异覆盖保留
- **WHEN** 某视觉差异无法仅通过变量映射表达
- **THEN** 该规则 MUST 保留在覆盖层组件文件中
- **AND** 规则 SHOULD 优先复用现有变量而非硬编码品牌值

### Requirement: 原型模块还原范围与实现约束
系统 MUST 以原型页面为基线维护 Storybook 回归场景，并 SHALL 覆盖 `header`、`menu`、`history-tabs`、`filter`、`metrics`、`chart`、`table` 七个模块的视觉与交互基线。

#### Scenario: 模块范围完整
- **WHEN** 维护 `Theme/Prototype Regression` 场景
- **THEN** 场景 MUST 按模块提供可对比的稳定结构与 class 锚点
- **AND** 不得缺失上述七个模块中的任一项

#### Scenario: ELP 优先实现
- **WHEN** 模块交互存在 Element Plus 对应组件能力（例如菜单、下拉、分页、标签）
- **THEN** 实现 MUST 以 ELP 组件为基础进行样式改造
- **AND** 不得使用纯自定义 `div` 结构重写等价基础交互

#### Scenario: 业务模块作用域约束
- **WHEN** `filter`、`metrics`、`chart`、`table` 需要补充业务样式
- **THEN** 规则 MUST 落在 `packages/vi/src/styles/workbench/*.less` 的业务作用域内
- **AND** 规则 MUST 优先复用 `--vi-*` / `--wb-*` / `--el-*` 变量链路

### Requirement: 主题引擎全局单例
系统 MUST 采用全局单例主题引擎，所有主题状态读取与写入 SHALL 共享同一状态源。

#### Scenario: 多调用点共享状态
- **WHEN** 应用内多个模块分别调用 `useViTheme()`
- **THEN** 它们 MUST 读取到同一 `themeKey` 与 `isDark` 状态
- **AND** 任一模块触发主题变更后，其他模块观察到的状态 MUST 同步更新

### Requirement: 主题配置入口唯一化
系统 MUST 将主题配置入口收敛为 `initViTheme(options)`；运行时消费入口 `useViTheme` SHALL 不再作为长期配置入口。

#### Scenario: 初始化配置生效
- **WHEN** 应用启动时调用 `initViTheme({ themeStorageKey, darkStorageKey })`
- **THEN** 主题引擎 MUST 按该配置初始化并应用主题
- **AND** 后续 `useViTheme()` 调用 MUST 复用已初始化配置

#### Scenario: 多项目初始主题可配置且持久化优先
- **WHEN** 应用启动时调用 `initViTheme({ defaultThemeKey })`
- **THEN** 系统 MUST 在“无本地持久化主题值”时使用该初始主题
- **AND** 用户后续切换主题后，系统 MUST 持久化并在刷新后优先恢复持久化值

### Requirement: 动态主题值单一来源
系统 MUST 以运行时主题引擎作为动态主题值的单一来源，并 SHALL 统一通过引擎输出更新语义变量。

#### Scenario: 切换主题时统一注入
- **WHEN** 用户切换主题色或明暗模式
- **THEN** 系统 MUST 通过引擎完成变量计算与注入
- **AND** `--el-*` 与 `--wb-*` 映射层 MUST 继续消费语义变量链路
