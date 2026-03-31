## ADDED Requirements

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

## MODIFIED Requirements

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
