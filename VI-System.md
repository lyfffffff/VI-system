# VI-System

## 文档定位
本文档用于沉淀 VI System 的工程工作流与架构方法，回答以下问题：
- 这个项目是按什么流程一步步构建出来的？
- 每次迭代的输入基线是什么？
- 日常开发必须遵守哪些项目规范？
- 主题 token 与样式分层如何设计和落地？

## 1. 工作流总览（OpenSpec 驱动）
项目采用 `spec-driven` 模式，主流程如下：

1. 明确需求边界与验收口径。
2. 在 `openspec/changes/<change-id>/` 产出：
   - `proposal.md`（背景/目标/范围/非目标/验收标准）
   - `design.md`（架构、状态流、风险与回滚）
   - `tasks.md`（可执行任务清单）
3. 实施代码改动（按任务推进）。
4. 运行构建与回归（`build:vi`、`build:storybook`、Storybook 场景检查）。
5. 归档到 `openspec/changes/archive/`，并将有效约束回填到 `openspec/specs/*`。

当前主规格：
- `openspec/specs/theme-system/spec.md`
- `openspec/specs/component-docs/spec.md`

## 2. 项目是如何一步步构建的（时间线）

### 2026-03-26：主题系统 V1 基线建立
Change：`add-vi-theme-drawer`
- 以业务既有实现为迁移来源，建立库级主题能力。
- 确立 17 主题、明暗模式、主题抽屉、语义变量链路。
- 明确 V1 排除水印能力。

### 2026-03-27：文档入口切换为 Storybook
Change：`adopt-storybook-docs`
- 引入 `apps/storybook` 作为唯一文档/预览入口。
- 迁移 ThemeDrawer 示例与 API 文档输出。
- 移除 Histoire 入口，避免双入口并存。

### 2026-03-31：V2 规范收敛
Change：`optimize-vi-theme-system-v2`
- 固化改造优先级：`CSS var > 业务 class > 直接覆盖组件内部样式`。
- 明确 token 到映射再到覆盖层的架构治理。
- 补充组件级改造与回归约束。

### 2026-04-02：ELP 覆盖作用域收敛
Change：`converge-elp-overrides-scope`
- 全局覆盖仅放 `.el-*`。
- 业务结构差异仅放 `.vi-theme-scope`。
- 清理冗余覆盖，保留“ELP 默认与原型差异”的最小集合。
- Storybook 预览样式拆分为宿主层与故事层。

### 2026-04-03：主题引擎单例化重构
Change：`refactor-theme-engine-singleton`
- 将主题链路拆分为 `resolver/applier/persistence/engine`。
- `initViTheme(options)` 收敛为唯一配置入口。
- `useViTheme()` 聚焦状态消费与操作，不再承担长期配置职责。

## 3. 输入基线（Input Baseline）

项目迭代时的关键输入并非“从零设计”，而是“基于已有成熟资产做规范化收敛”：

- 业务主题实现基线：`ad-center-web-source`（主题配置、色值算法、状态管理、抽屉交互）。
- 原型视觉与交互基线：`askdata-dashboard / data-cockpit` 页面。
- 设计规范参考：`junelce-workbench-design-system/references/*`。
- 验证基线：Storybook 场景（`主题/主题抽屉`、`主题/原型回归`）。

这套输入基线保证了两件事：
- 不脱离业务真实形态做“空中楼阁”设计。
- 每次收敛都能回到可见可测的原型与文档场景。

## 4. 必须遵守的项目规范

### 4.1 OpenSpec 规范
- 所有 OpenSpec 产物使用简体中文（技术名词可保留英文）。
- proposal/design/tasks/spec 各自字段与结构必须完整。
- 先更新规范与任务，再推进实现，最后归档回填。

### 4.2 主题系统实现规范
- 主题配置入口唯一：`initViTheme(options)`。
- 主题引擎为全局单例，状态源统一。
- 默认主题为 `teal`，支持 `defaultThemeKey` 仅在“无持久化值”时生效。

### 4.3 样式治理规范
- 样式改造优先级固定：`CSS var > 业务 class > 直接覆盖组件内部样式`。
- 覆盖作用域固定：
  - 通用修正：全局 `.el-*`
  - 业务差异：`.vi-theme-scope`
- 新覆盖规则按组件拆分，禁止回到单文件堆叠。

### 4.4 文档与回归规范
- Storybook 是唯一文档入口。
- 新增/调整 Story 时，要同步维护 `docs/guides/storybook-guide.md` 的分组与场景说明。
- 对主题改动，必须回归以下场景：
  - `主题/主题抽屉`
  - `主题/原型回归`

### 4.5 代码风格规范（实现层）
- 命名、模块拆分、Vue/TS/Less 写法统一遵循：
  - `.codex/skills/vi-system-code-style/SKILL.md`

## 5. Token 设计层级与状态流

### 5.1 分层架构
```text
Design Tokens (tokens.less)
  -> 语义变量层 (semantic-vars.less, --vi-*)
    -> 映射层
      -> Element Plus 映射 (element-plus-mapping.less, --el-*)
      -> Workbench 映射 (workbench-mapping.less, --wb-*)
        -> 覆盖层 (workbench-overrides.less + element-ui/*.less + workbench/*.less)
          -> 组件渲染
```

### 5.2 运行时链路
1. 应用启动：`initViTheme(options)` 初始化单例引擎。
2. 引擎读取持久化状态（`themeKey`、`isDark`）。
3. `theme-resolver` 计算变量。
4. `theme-applier` 注入根节点变量并同步 `html.dark`。
5. 组件通过 `--vi-* -> --el-* / --wb-*` 消费主题值。

### 5.3 局部主题策略
- 在 `.vi-theme-scope` 内允许覆写语义变量，作用域内优先生效。
- 未覆写变量自动回退全局值。
- 不建议以直接覆写 `--el-*` 作为长期方案。

## 6. 标准交付步骤（建议）
1. 先读 `openspec/specs/*` 与相关归档 change，确认边界。
2. 对照基线原型与 Storybook 场景，定义最小改动范围。
3. 优先改变量层，再改映射层，最后才加覆盖层。
4. 执行构建与场景回归：
   - `pnpm build:vi`
   - `pnpm build:storybook`
5. 完成文档更新与 OpenSpec 状态同步，再归档。

---

如需进入具体实现，可配合：
- `README.md`（快速上手与接入）
- `docs/guides/storybook-guide.md`
- `docs/guides/theme-drawer.md`
- `docs/guides/theme-mapping-checklist.md`
