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

### Requirement: 样式调优输入来源白名单
系统 MUST 在样式细节调优过程中仅使用两类输入来源：`junelce-workbench-design-system` 与原型源码 `workbench-theme`。

#### Scenario: 调优输入来源校验
- **WHEN** 开发者提交样式调优变更
- **THEN** 变更说明 MUST 标注每项关键样式差异的来源
- **AND** 来源 MUST 属于 `junelce-workbench-design-system` 或 `workbench-theme`
- **AND** 不得引入第三方或未约定来源作为样式对齐基线

### Requirement: 分层样式统一执行顺序
系统 MUST 按 `tokens -> semantic -> mapping -> overrides` 的顺序执行样式统一，并 SHALL 将覆盖层限制为最小差异兜底。

#### Scenario: 变量层优先收敛
- **WHEN** 发现样式差异可通过变量表达
- **THEN** 实现 MUST 优先在 `tokens`、`semantic` 或 `mapping` 层修正
- **AND** 不得直接以 `overrides` 作为首选修复手段

#### Scenario: 覆盖层最小差异保留
- **WHEN** 某视觉差异无法仅通过变量链路表达
- **THEN** 实现 MAY 在 `overrides` 层补充规则
- **AND** 规则 MUST 仅保留必要差异，且可追溯到白名单输入来源

### Requirement: 原型回归场景样式一致性验收
系统 MUST 以 Storybook 原型回归场景验证样式统一结果，并 SHALL 在亮/暗模式下覆盖核心模块交互态检查。

#### Scenario: 核心模块回归通过
- **WHEN** 完成一轮样式细节调优
- **THEN** `Theme/Prototype Regression` 场景中的核心模块 MUST 通过一致性验收
- **AND** 验收记录 MUST 包含亮/暗模式及关键交互态（hover/focus/active/disabled）检查结果

### Requirement: Storybook 开发态源码联调
系统 MUST 在 Storybook 开发态优先消费工作区源码（`packages/vi/src`），并 SHALL 保证 Vite 文件系统访问范围覆盖 Storybook 应用根与仓库根目录。

#### Scenario: 开发态样式修改即时生效
- **WHEN** 开发者在 `packages/vi/src/styles/**` 修改样式并启动 Storybook
- **THEN** 预览 MUST 直接反映源码改动
- **AND** 不得要求先执行 `packages/vi` 构建才能在 Storybook 看到最新样式

#### Scenario: 工作区源码访问可用
- **WHEN** Storybook 通过 alias 读取 `@yyxxfe/vi` / `@yyxxfe/vi/styles`
- **THEN** Vite MUST 允许访问 Storybook 工程目录与仓库根目录
- **AND** 不得出现由 `server.fs.allow` 过窄导致的 403 读盘错误

### Requirement: Story 样式归属与隔离
系统 MUST 将 Story 专用页面样式就近归属到对应 Story 组件文件，且 SHALL 避免将业务故事样式集中放在 `.storybook/story-styles` 全局目录中。

#### Scenario: ThemeDrawer Story 样式归属
- **WHEN** 维护 `theme-drawer` 相关 Story
- **THEN** 页面级样式 MUST 放在对应 `theme-drawer-*.vue` 文件中
- **AND** 同类样式不得依赖全局 `story-styles` 文件才能生效

#### Scenario: DataCockpit Story 样式归属
- **WHEN** 维护 `data-cockpit-prototype` Story
- **THEN** 页面壳层样式 MUST 放在 `data-cockpit-prototype.vue` 内或其就近模块
- **AND** 样式变更 SHOULD 与模块模板一并评审

### Requirement: 暗色模式主题色阶算法一致性
系统 MUST 在暗色模式下采用独立色阶生成策略（暗底混色），并 SHALL 通过同一主题解析流程注入变量映射层。

#### Scenario: 暗色模式切换主题色
- **WHEN** 用户处于暗色模式并切换主题色
- **THEN** `light3/light5/light7/light8/light9` MUST 基于暗底混色生成
- **AND** `theme-resolver` MUST 将暗色模式状态传递给色阶计算函数

#### Scenario: 亮暗模式色阶隔离
- **WHEN** 同一主题在亮色与暗色模式下渲染
- **THEN** 两种模式下的色阶结果 MUST 可区分
- **AND** 不得复用单一"亮色混白"色阶结果

### Requirement: 表格 Hover 变量优先级收敛
系统 MUST 在 `el-table` 组件层显式收敛 hover 变量优先级，保证普通列与固定列在横向滚动场景下背景一致且不透底。

#### Scenario: 组件层变量覆盖生效
- **WHEN** Element Plus 在 `.el-table` 上声明默认 `--el-table-row-hover-bg-color`
- **THEN** VI 覆盖层 MUST 在 `.el-table` 层回写目标 hover 变量
- **AND** 仅在 `:root` 映射层设置变量视为不充分

#### Scenario: 固定列横向滚动一致性
- **WHEN** 表格存在固定列并触发 hover 态
- **THEN** 固定列与非固定列背景 MUST 保持一致
- **AND** 不得出现底层单元格文字/背景透出的视觉异常

### Requirement: 原型页面模块化拆分与数据契约
系统 MUST 将 `data-cockpit-prototype` 拆分为独立模块组件，并 SHALL 使用统一的 `mock-data.ts` 提供页面级与模块级数据契约。

#### Scenario: 模块边界清晰
- **WHEN** 维护驾驶舱原型页面
- **THEN** `header/menu/history/conditions/metrics/chart/table` MUST 作为独立组件维护
- **AND** 页面文件 SHOULD 仅负责编排与状态流转

#### Scenario: 数据契约集中管理
- **WHEN** 新增或调整原型模块数据
- **THEN** 变更 MUST 优先落在 `mock-data.ts`
- **AND** 组件间不得复制分叉同义数据结构

### Requirement: 主题主包导出能力边界收敛
系统 MUST 将 `@yyxxfe/vi` 主入口导出聚焦于主题系统核心能力，并 SHALL 避免导出与主题主能力弱相关的通用 UI 工具函数。

#### Scenario: 主入口导出检查
- **WHEN** 团队维护 `packages/vi/src/index.ts` 导出项
- **THEN** 导出内容 MUST 以主题初始化、主题状态、主题配置与主题组件为主
- **AND** 与主题能力弱相关的辅助工具（如自动列宽测量）MUST NOT 作为主入口长期导出

#### Scenario: 原型场景去除弱相关依赖
- **WHEN** Storybook 原型场景存在对弱相关工具导出的依赖
- **THEN** 场景实现 MUST 改为本地可维护策略（如静态配置）
- **AND** 不得影响主题切换、亮暗模式与样式链路回归能力

### Requirement: 主题库多格式导出支持
系统 MUST 提供同时支持 ESM 和 CJS 格式的主题库导出，并 SHALL 包含完整的 TypeScript 类型定义。

#### Scenario: ESM 项目导入
- **WHEN** ESM 项目导入 `@yyxxfe/vi`
- **THEN** 系统 MUST 提供标准的 ESM 入口 (`./dist/index.js`)
- **AND** 类型定义 MUST 可用 (`./dist/index.d.ts`)

#### Scenario: CJS 项目导入
- **WHEN** CJS 项目通过 require 导入 `@yyxxfe/vi`
- **THEN** 系统 MUST 提供标准的 CJS 入口 (`./dist/index.cjs`)
- **AND** 类型定义 MUST 可用

#### Scenario: 按需导入
- **WHEN** 使用方仅导入特定功能（如主题 API 或 ThemeDrawer 组件）
- **THEN** 系统 MUST 提供独立的导出入口
- **AND** Tree Shaking MUST 生效以减小包体积

### Requirement: 主题库样式正确导出
系统 MUST 将主题样式正确导出为独立的 CSS 文件，并 SHALL 支持使用方按需引入。

#### Scenario: 样式文件导出
- **WHEN** 使用方导入 `@yyxxfe/vi/styles`
- **THEN** 系统 MUST 返回编译后的 CSS 文件 (`./dist/style.css`)
- **AND** CSS MUST 包含所有必要的 CSS 变量定义

#### Scenario: 样式按需引入
- **WHEN** 使用方仅使用部分主题功能
- **THEN** 使用方 MAY 选择性地引入样式文件
- **AND** 样式文件 MUST 包含所有必要的样式（不支持部分样式抽取）

#### Scenario: 双入口样式打包
- **WHEN** 执行 vi 库构建
- **THEN** 系统 MUST 产出 `style.css`（通用样式入口）
- **AND** 系统 MUST 产出 `element-plus.css`（Element Plus 组件样式覆盖）
- **AND** 系统 MUST 产出 `workbench.css`（Workbench 业务样式）
- **AND** `style.css` MUST NOT 包含 workbench-mapping 和 workbench/ 目录下的样式

#### Scenario: 样式入口文件职责
- **WHEN** 维护样式入口文件
- **THEN** `src/index.ts` MUST 导入 `styles/index.less` 和组件样式
- **AND** `src/element-plus.ts` MUST 导入 EP 变量映射和组件覆盖样式
- **AND** `src/workbench.ts` MUST 导入 WB 变量映射和业务样式
- **AND** 各入口 MUST 保持依赖顺序正确（基础变量 → 映射层 → 覆盖层）
