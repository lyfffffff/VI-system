## Context

本次变更聚焦 `overrides` 层治理，不改 token、semantic、mapping 三层能力。现有覆盖文件中部分规则既可全局生效，也被放入宽作用域容器，造成“覆盖意图不清晰”；同时存在可以由变量映射承接但仍在 overrides 重复声明的情况。

参考输入：
- 原型样式：`F:/web_git_frontend/ask-data/demo/src/styles/workbench-theme.css`
- 组件规范：`junelce-workbench-design-system/references/component-specs.md`

约束：
- 保持 `Vue 3 + Less + Element Plus` 体系。
- 不扩大覆盖范围，不新增跨层硬编码。
- 仅在必要处使用 `!important`（如 Element Plus 固定列背景）。

## Goals / Non-Goals

**Goals:**
- 建立覆盖判定矩阵：
  - 全局规范差异 -> 全局 `.el-*`
  - 业务场景差异 -> `.vi-theme-scope`。
- 清理 overrides 冗余规则，保持最小覆盖。
- 让每个覆盖文件职责单一、作用域清晰。

**Non-Goals:**
- 不调整主题算法与变量生成。
- 不新增业务样式模块文件。
- 不在本次引入新的 ELP 组件覆盖范围。

## 架构方案

维持现有四层架构不变，仅优化第四层 `overrides`：
1. 全局覆盖文件输出基础 `.el-*` 规则（所有接入页面一致）。
2. 作用域差异使用 `.vi-theme-scope { ... }` 包裹（仅业务容器生效）。
3. 不再使用多容器混合作用域（如 `.workbench-layout/.cockpit-page/.story-root`）作为默认策略。

## 数据 / 状态流

1. 主题变量继续由 `token -> semantic -> mapping` 注入。
2. ELP 组件先消费映射变量。
3. 覆盖层仅在映射层无法表达时补齐：
   - 全局规则先命中；
   - 业务差异在 `.vi-theme-scope` 内追加。

## 扩展性设计

- 新增覆盖规则时先判断“是否全局可复用”。
- 仅当规则依赖业务容器、拼接结构、业务 class 时，进入 `.vi-theme-scope`。
- 规则优先使用已有变量，不引入硬编码品牌色。

## Decisions

### 1. 选择器分层固定化
- 决策：全局覆盖直接写 `.el-*`，作用域覆盖统一放在 `.vi-theme-scope`。
- 理由：可读性高，回归定位快。
- 备选：继续多容器 `:where(...)` 混合。
  - 未选原因：覆盖边界不清晰，易误伤。

### 2. 覆盖保留“差异最小集”
- 决策：删除与映射层重复或与原型无差异规则。
- 理由：降低维护成本与升级风险。
- 备选：保留历史规则以“防回归”。
  - 未选原因：会持续放大样式债务。

### 3. 业务结构差异使用 `.vi-theme-scope`
- 决策：如 `date-picker-joined`、`shortcut-btn` 等结构性差异限定在 `.vi-theme-scope`。
- 理由：避免影响非业务场景。
- 备选：全局直接覆盖。
  - 未选原因：影响面不可控。

## Risks / Trade-offs

- [风险] 删除冗余覆盖后，个别 Storybook 场景出现视觉差异
  -> [缓解] 通过 `ThemeRegression` 与 `ComponentRegression` 回归验证。

- [风险] 业务页面未包裹 `.vi-theme-scope` 导致作用域规则不生效
  -> [缓解] 在接入文档明确容器要求，并优先将基础规则保持全局。

- [权衡] 全局规则增多会影响全部 ELP 组件
  -> [收益] 与“ELP/原型差异”保持一致，减少重复局部覆盖。

## Migration Plan

1. 先补齐 OpenSpec 任务与规范。
2. 逐文件收敛 overrides：先全局规则，再作用域规则。
3. 构建验证并检查生成 CSS。
4. 如发现回归，按文件回退到上一个稳定版本并逐条恢复。

回滚策略：
- 覆盖层变更可按文件粒度快速回滚。
- 入口文件 `workbench-overrides.less` 保持稳定导入顺序，确保回滚可控。

## Open Questions

1. `.vi-theme-scope` 是否需要在文档中升级为“强制接入约定”？
2. 后续是否将 Popper/Tooltip 等弹层类覆盖也纳入同一收敛批次？
