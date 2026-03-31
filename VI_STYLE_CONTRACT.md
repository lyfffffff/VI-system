# VI Style Contract

## 1. 目标
VI 视觉库的核心目标是：
- 统一视觉表达（以原型为目标）
- 约束修改范围（避免无边界覆盖）
- 保持可扩展与可回滚

本 contract 用于指导 `packages/vi` 的样式改造与评审。

## 2. 适用范围
- 适用目录：`packages/vi/src/styles/**`、`apps/storybook/src/stories/**`、`docs/guides/**`
- 适用对象：Element Plus 基础组件映射、业务壳层样式、主题切换与暗黑模式
- 不适用：业务页面结构重构、与主题无关的交互逻辑改造

## 3. 分层模型（必须遵守）
1. `tokens` 层：原子值（颜色、圆角、间距、阴影）
2. `semantic-vars` 层：语义变量（surface/text/border/fill/interactive）
3. `mapping` 层：映射到 `--el-*` 与 `--wb-*`
4. `overrides` 层：仅做变量不足时的结构性兜底

优先级规则：`CSS var > 业务 class > 直接覆盖组件内部样式`

## 4. 修改边界

### 4.1 允许修改
- `packages/vi/src/styles/tokens.less`
- `packages/vi/src/styles/semantic-vars.less`
- `packages/vi/src/styles/element-plus-mapping.less`
- `packages/vi/src/styles/workbench-mapping.less`
- `packages/vi/src/styles/overrides/el-*.less`（或组件同名文件）
- `packages/vi/src/styles/workbench-overrides.less`（仅 import 聚合顺序）

### 4.2 禁止修改（除非明确评审通过）
- 无作用域的全局 `.el-*` 覆盖
- 在业务项目中直接硬改库内部样式
- 用 `!important` 作为常规手段覆盖 Element Plus
- 直接改组件 DOM 结构来“适配样式”

## 5. 组件改造决策树
1. 先判断能否通过 `semantic-vars + mapping` 解决
2. 不能解决时，使用业务 class（作用域内）
3. 仍不能解决时，进入组件级 overrides（最小覆盖）

每次改造都要注明归属层：`变量层 / 组件层 / 业务层`。

## 6. 作用域规范
- 默认作用域：`.vi-theme-scope`
- 可扩展作用域：`.workbench-layout`、`.cockpit-page`、`.story-root`
- 局部主题覆盖仅允许改语义变量（如 `--vi-color-primary`），不允许常态化改 `--el-*`

## 7. 文件组织规范
- overrides 按组件拆分：一个组件一个文件
- 建议命名：与 Element Plus 组件名对应（如 `el-button.less`、`el-input.less`）
- 聚合入口只负责 import，不写业务规则

## 8. 原型还原策略
- Storybook 回归场景用于“组件能力验收”，不等同业务页面 1:1 还原
- 原型级页面还原请在业务 class 层实现（例如 `time-filter-bar`），禁止污染全局组件
- 先做视觉对齐，再评估是否可以下沉到变量层复用

## 9. 验收门槛（Definition of Done）
- 亮/暗模式均通过
- 17 主题切换不破坏组件状态
- Storybook 至少覆盖：button/input/select/textarea/table/tabs/radio/dialog/drawer
- 无新增无作用域全局 `.el-*` 覆盖
- 文档同步（guide + OpenSpec）

## 10. 回滚与风险控制
- 每次样式改造保持“可单文件回滚”
- 若出现大面积回归，优先回退 overrides 文件，再回退映射层
- 避免跨层混改（同一次提交同时改 token、mapping、业务 class 且无说明）

## 11. 评审清单
- 这次改动属于哪一层？
- 是否存在更低破坏性的实现路径？
- 是否新增了无作用域覆盖？
- Storybook 是否有对应回归场景？
- 是否补充了迁移说明与回滚策略？
