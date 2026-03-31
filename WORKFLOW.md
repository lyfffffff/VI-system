# VI 公共库需求规范（草案）

## 1. 项目目标
- 建设一套基于 `Vue 3 + TS + Vite + Less` 的 VI（视觉规范）公共库。
- 以 Less 作为设计源头，以 CSS Variables 作为运行时中枢（Variable Hub）。
- 在不改业务组件代码的前提下，实现 Element Plus 与 Workbench 风格的主题一致性。

## 2. V1 范围（先做）
- Token 体系（颜色/间距/圆角/阴影/字体）定义与管理。
- Less -> CSS Variables 编译输出。
- 语义变量层到 `--el-*` 的变量映射（默认前缀 `--vi-*`）。
- Workbench 风格变量层（`--wb-*`）统一管理。
- Histoire 主题调试与实时预览。
- 私有包发布到 GitLab NPM Registry。

## 3. V1 非范围（暂不做）
- 业务组件库（复杂业务组件封装）。
- 大规模页面模板工程。
- 与主题无关的功能性工具库扩展。

## 4. 核心架构原则
## 4.1 Variable Hub
- 设计源：Less Token。
- 输出源：语义变量层（默认前缀为 `--vi-*`，前缀可配置）。
- 适配层：`--el-*` / `--wb-*` 映射到语义变量层。
- 组件层禁止硬编码颜色，统一消费 CSS 变量。

前缀约束：
1. `--vi-` 作为 V1 默认实现前缀。
2. 前缀不是最终锁定规范，可在后续统一替换为新前缀。
3. 组件层不允许依赖“品牌前缀语义”，仅依赖语义 token 名称与映射关系。

## 4.2 约束
- 零魔法数：间距、圆角、阴影、字号必须映射到 Token。
- Less 色彩计算（`darken()`/`fade()`）优先在编译期完成。
- 运行时只做变量替换与主题切换，不做复杂色值计算。

## 4.3 暗黑模式
- 双层机制：
1. CSS `html.dark` 兜底（防止 FOUC）。
2. JS 运行时注入覆盖（跟随用户主题选择）。

## 5. 主题扩展 Contract
## 5.1 新增一套主题色（产品新增主题）
1. 在 `themePresets` 新增 `themeKey` 与主色 `primary`。
2. 用统一算法自动生成派生色（light/dark/rgb）。
3. 主题切换仅通过 `setTheme(themeKey)` 生效。
4. Histoire 增加该主题选项用于验收演示。

要求：新增主题不应触发组件样式文件改动。

## 5.2 某主题局部颜色变更（主题维护）
1. 若改品牌主色：修改该主题 preset 的 `primary`。
2. 若改语义色（成功/警告/背景/hover）：修改该主题 override。
3. 组件代码不改，继续依赖语义变量层（默认 `--vi-*`）。

要求：变更路径应集中在主题配置，不扩散到组件层。

## 5.3 项目接入 VI 库（消费方式）
推荐入口：
- `import "@yyxxfe/vi/css"`：基础变量与映射层。
- `import "@yyxxfe/vi/element-plus"`：Element Plus 覆盖层。
- 运行时调用 `setTheme("teal")`（并结合 localStorage 持久化）。

要求：业务项目仅做主题选择和少量覆盖，不维护底层 token 计算。

## 5.4 业务项目覆盖某主题某个颜色
优先覆盖语义变量层（默认 `--vi-*`，不直接覆盖 `--el-*`）：

```css
:root[data-theme='teal'] {
  --vi-color-primary: #0ea5e9;
}
```

或运行时覆盖：

```ts
document.documentElement.style.setProperty('--vi-color-primary', '#0ea5e9')
```

要求：覆盖点可控、可回滚、可审计（建议集中在业务覆盖文件）。

## 6. 主题设置抽屉功能（V1 必做）
## 6.1 概述
- 提供统一的主题设置抽屉（右侧滑出），用于管理界面模式与主题色。
- 作为业务项目消费 VI 库的标准入口，不允许各页面重复造轮子。

## 6.1.1 二次开发基线
- V1 以 `F:\web_git_frontend\ad-center-web-source` 已有主题抽屉实现作为基线进行二次开发。
- 重点复用：`theme.config`、`useThemeColor`、`theme-drawer` 的核心交互与主题注入链路。
- 改造目标：从“项目内实现”升级为“可发布的 VI 公共库能力”。

## 6.2 功能范围
- 模式切换：浅色模式 / 暗黑模式。
- 主题色切换：预设主题色列表（V1 固定为 17 个，后续可扩展）。
- 响应式适配：在常见桌面与窄屏下保持可用性。

## 6.3 交互与布局要求
- 抽屉从右侧滑出，支持打开/关闭动画。
- 顶部标题区：`主题设置`。
- 分组区块：
1. 模式设置（浅色 / 暗黑两种卡片式选项）。
2. 主题颜色（色板网格，选中态高亮）。
- 当前选中项需要明确视觉反馈（边框、图标或背景态）。

## 6.4 状态与持久化
- 主题 key 与暗黑模式状态需要持久化（`localStorage`）。
- 首次加载按“持久化配置 -> 默认配置”优先级恢复。
- 切换后即时生效：更新 `document.documentElement` 上的 CSS Variables。

## 6.5 与主题 Contract 的关系
- 新增主题：仅新增 preset，抽屉自动展示新主题项。
- 主题改色：仅改主题配置，抽屉无需改结构。
- 业务覆盖：业务项目覆写语义变量层（默认 `--vi-*`）后，抽屉交互仍可工作。

## 6.6 验收补充
- 切换浅/暗模式时无明显闪烁（满足 fallback 要求）。
- 切换主题色后，Element Plus 与 Workbench 样式同步。

## 6.7 抽屉对外 API 约定（已定）
- 采用“两层 API”：
1. 能力层（Headless）：`useViTheme()`
2. 组件层（UI）：`<ViThemeDrawer />`

### 能力层（推荐主入口）
- 状态：`themeKey`、`isDark`
- 方法：`setTheme(key)`、`toggleDark()`
- 行为：内部负责 `localStorage` 持久化与 CSS Variables 注入。

### 组件层（标准抽屉）
- 用法：`<ViThemeDrawer v-model:open="open" />`
- Props：`themes`（默认17个）、`placement`（默认`right`）
- Emits：`update:open`、`theme-change`、`mode-change`

### 包导出建议
- `@yyxxfe/vi/theme`：导出 `useViTheme`
- `@yyxxfe/vi/theme-drawer`：导出 `ViThemeDrawer`

## 7. 工程化交付要求
- 包管理：私有包发布到 GitLab NPM Registry。
- 导出策略：`exports` 多入口（`css`/`less`/`scss`）。
- 文档演示：Histoire 提供主题切换与变量调试面板。
- 版本管理：语义化版本，主题变更记录可追踪。

## 8. 验收标准（V1）
- 主题切换后，Element Plus 与 Workbench 视觉同步。
- 暗黑模式切换无明显闪烁（有 CSS fallback）。
- 业务项目可在不改组件代码的前提下替换主题。
- 可新增主题、可局部改色，且改动范围符合 Contract。
- Histoire 可实时验证变量调整结果。
- 主题设置抽屉可完成模式/主题色的统一管理。

## 9. 待确认项（下一轮讨论）
1. 语义变量前缀最终命名（当前默认 `--vi-`）与 `--wb-*` 边界是否统一成单语义层。

## 10. 开发任务清单（执行版）
## 10.1 M0 - 工程初始化与目录落地
- [ ] 初始化库工程（Vue 3 + TS + Vite + Less）。
- [ ] 建立基础目录：`tokens`、`variables`、`themes`、`element-plus`、`workbench`、`theme-drawer`。
- [ ] 配置构建入口与类型声明入口。
- [ ] 建立基础校验：`lint`、`typecheck`、`build`。

交付物：
- 可运行的基础工程与空实现入口。

完成标准：
- 本地可执行 `build`，产物目录可生成。

## 10.2 M1 - Token 与 Variable Hub
- [ ] 定义基础 Token（颜色/间距/圆角/阴影/字体）。
- [ ] 建立语义变量层（默认前缀 `--vi-*`，保留可替换能力）。
- [ ] 完成 `--el-*` 映射层（Element Plus 关键变量）。
- [ ] 完成 `--wb-*` 映射层（Workbench 关键变量）。
- [ ] 建立暗黑 CSS fallback（`html.dark` 基础变量）。

交付物：
- `tokens.less`、语义变量输出、EP/WB 映射样式文件。

完成标准：
- 在静态页面中仅切换变量即可看到 EP/WB 样式联动。

## 10.3 M2 - 主题引擎（17主题）
- [ ] 实现主题 preset 注册（V1 固定 17 个主题）。
- [ ] 实现主题派生算法（light/dark/rgb）。
- [ ] 实现能力层 `useViTheme()`。
- [ ] 实现状态持久化（`localStorage`）与启动恢复。
- [ ] 实现运行时注入（`setTheme`、`toggleDark`）。

交付物：
- `@yyxxfe/vi/theme` 可用 API。

完成标准：
- 切换 17 个主题与浅/暗模式均可即时生效，刷新后状态保持。

## 10.4 M3 - 主题设置抽屉
- [ ] 开发 `<ViThemeDrawer />`（右侧滑出、分组结构）。
- [ ] 接入模式切换（浅色/暗黑）。
- [ ] 接入 17 主题色板与选中态反馈。
- [ ] 实现响应式适配。
- [ ] 输出组件事件：`update:open`、`theme-change`、`mode-change`。

交付物：
- `@yyxxfe/vi/theme-drawer` 组件。

完成标准：
- 抽屉完成模式/主题两项控制，且与能力层联动正常。

## 10.5 M4 - Element Plus / Workbench 覆盖实现
- [ ] 实现按钮、输入框、表格、分页等核心覆盖样式。
- [ ] 实现 fixed 列背景修复、红涨绿跌、等宽数字等规则。
- [ ] 实现弹窗内控件圆角差异（页面 10px / 弹窗 6px）。
- [ ] 检查并清理硬编码颜色，统一改为变量引用。

交付物：
- 覆盖样式包与示例页面。

完成标准：
- 关键组件样式符合当前 Workbench 规范且支持主题切换。

## 10.6 M5 - Histoire 演示与文档
- [ ] 建立 Theme Playground（实时改变量、切换主题、切换暗黑）。
- [ ] 建立 EP 同步演示（按钮/表单/表格联动）。
- [ ] 建立 Workbench 演示（布局/面板/标签/趋势色）。
- [ ] 完成接入文档与覆盖策略文档。

交付物：
- Histoire 示例集与开发文档。

完成标准：
- 评审人员可通过 Histoire 完整验证主题能力。

## 10.7 M6 - 发布与质量保障
- [ ] 配置 `exports` 多入口（`css`/`less`/`scss`/`theme`/`theme-drawer`）。
- [ ] 配置 GitLab NPM Registry 发布流程。
- [ ] 建立基础测试（主题切换、持久化、变量注入）。
- [ ] 建立版本与变更记录流程（语义化版本）。

交付物：
- 可安装私有包版本（V1）。

完成标准：
- 业务项目按规范可直接安装、引入并使用。

## 10.8 任务优先级与并行建议
- P0（必须先做）：M0、M1、M2。
- P1（核心能力闭环）：M3、M4。
- P2（交付完善）：M5、M6。
- 可并行：M4 与 M5 可并行推进；M6 在 M3 稳定后启动。
