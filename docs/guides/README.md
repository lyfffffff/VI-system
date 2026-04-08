# 规范与工作流索引（Single Source of Truth）

本文件用于降低规范文档分散带来的认知负担。  
默认按“先看什么、执行什么、校验什么”组织。

## 1. 当前权威入口（优先使用）

1. `docs/guides/storybook-guide.md`  
   Storybook 开发/命名/文档输出规则。

## 2. 主题接入文档（功能域）

- `docs/guides/theme-drawer.md`：ThemeDrawer API、接入步骤（初始化、局部覆盖）与事件契约。  
- `docs/guides/theme-mapping-checklist.md`：映射项核对清单。

## 3. 项目级规范（横向约束）

- `.codex/skills/vi-system-code-style/SKILL.md`：代码风格与实现约束。
- `.codex/skills/advanced-civilization/SKILL.md`：对话规范

## 4. OpenSpec 归档与历史记录

- 活跃/主规范：`openspec/specs/*`
- 历史归档：`openspec/changes/archive/*`

推荐读取顺序：
1. 先看 `openspec/specs/*`（当前生效规范）
2. 再看相关 archive change（历史决策与迁移上下文）

## 5. 说明

- 代码规范统一以 `.codex/skills/vi-system-code-style/SKILL.md` 为准。
- 对话规范统一以 `.codex/skills/advanced-civilization/SKILL.md` 为准。
