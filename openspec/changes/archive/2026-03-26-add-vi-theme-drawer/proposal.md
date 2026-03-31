## Why

当前 VI 系统已经明确了主题能力目标（17 预设主题、暗黑模式、主题抽屉、语义变量分层），但缺少可执行的 OpenSpec 变更基线。  
`ad-center-web-source` 已有可运行的主题抽屉实现，具备较高复用价值；将其迁移并沉淀为 VI 公共库可以显著降低重复开发成本，并统一多项目主题实现标准。

### 背景
- 现状：主题能力主要存在于业务项目，缺少库级抽象与统一对外 API。
- 机会：复用 `ad-center-web-source` 的成熟实现，快速形成 VI 库 V1 能力闭环。

### 目标
- 以 `ad-center-web-source` 为二次开发基线，完成主题引擎与主题抽屉的库化迁移。
- 建立“语义变量层（默认 `--vi-*`）-> `--el-*`/`--wb-*` 映射层”的标准链路。
- 确保 OpenSpec、代码实现、文档接入三者一致。

### 范围
- 包含：17 主题、浅/暗模式、主题抽屉、变量映射、接入文档、OpenSpec 规格。
- 不包含：水印相关能力（V1 明确排除）。

### 非目标
- 不实现业务组件库扩展。
- 不引入服务端主题同步。
- 不实现自定义主题编辑器（色板编辑）。

### 验收标准
- 17 主题切换与浅/暗模式切换实时生效，刷新后状态可恢复。
- 主题抽屉可完成“模式+主题色”管理，不包含水印控制。
- 组件层不直接依赖品牌变量，遵循语义变量分层。

## What Changes

- 新增 `add-vi-theme-drawer` 变更，定义主题系统库化迁移方案。
- 将 ad-center 的主题配置、主题计算、主题状态管理与主题抽屉迁移到 VI 库分层结构。
- 新增语义变量层到 Element Plus / Workbench 映射策略，统一主题注入顺序。
- 统一对外 API：`useViTheme` 与 `<ViThemeDrawer />`。
- 新增接入文档与迁移文档，明确业务项目使用方式。
- **BREAKING**：迁移后组件层不得再直接依赖业务项目私有主题变量写法，必须走语义变量层。

## Capabilities

### New Capabilities
- `theme-system`: 提供 VI 库级主题系统能力，覆盖 17 主题预设、浅/暗模式、语义变量映射与主题抽屉交互。

### Modified Capabilities
- （无）

## Impact

- **受影响代码**
  - 迁移来源：`F:\web_git_frontend\ad-center-web-source\src\config\theme.config.ts`
  - 迁移来源：`F:\web_git_frontend\ad-center-web-source\src\utils\colorUtils.ts`
  - 迁移来源：`F:\web_git_frontend\ad-center-web-source\src\composables\useThemeColor.ts`
  - 迁移来源：`F:\web_git_frontend\ad-center-web-source\src\components\theme\theme-drawer.vue`
  - 迁移来源：`F:\web_git_frontend\ad-center-web-source\src\styles\theme.less`
- **受影响系统**
  - VI 库主题引擎与样式映射层
  - 业务项目主题接入方式（由项目内实现迁移为库能力）
- **依赖影响**
  - 继续依赖 Vue 3、TypeScript、Element Plus、Less
  - 不新增水印相关依赖与实现
