## ADDED Requirements

### Requirement: 主题引擎全局单例
系统 MUST 采用全局单例主题引擎，所有主题状态读取与写入 SHALL 共享同一状态源。

#### Scenario: 多调用点共享状态
- **WHEN** 应用内多个模块分别调用 `useViTheme()`
- **THEN** 它们 MUST 读取到同一 `themeKey` 与 `isDark` 状态
- **AND** 任一模块触发主题变更后，其他模块观察到的状态 MUST 同步更新

### Requirement: 主题配置入口唯一化
系统 MUST 将主题配置入口收敛为 `initViTheme(options)`；运行时消费入口 `useViTheme` SHALL 不再作为长期配置入口。

#### Scenario: 初始化配置生效
- **WHEN** 应用启动时调用 `initViTheme({ prefix, themeStorageKey, darkStorageKey })`
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

### Requirement: 前缀兼容同步策略
系统 MUST 支持自定义前缀变量输出，并 SHALL 默认开启 `syncDefaultViPrefix` 以同步输出 `--vi-*` 兼容变量。

#### Scenario: 自定义前缀默认兼容
- **WHEN** 初始化配置使用自定义前缀且未显式关闭兼容同步
- **THEN** 系统 MUST 同时输出自定义前缀变量与 `--vi-*` 变量
- **AND** 既有依赖 `--vi-*` 的样式 MUST 继续生效
