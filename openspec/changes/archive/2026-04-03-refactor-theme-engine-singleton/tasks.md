## 1. 引擎分层骨架建立

- [x] 1.1 新增 `packages/vi/src/theme/theme-resolver.ts`，抽离主题变量纯计算逻辑（不访问 DOM / storage）。
- [x] 1.2 新增 `packages/vi/src/theme/theme-applier.ts`，封装变量批量注入、`data-*` 同步与 `html.dark` 切换。
- [x] 1.3 新增 `packages/vi/src/theme/theme-persistence.ts`，封装主题存储读写与异常回退。
- [x] 1.4 新增 `packages/vi/src/theme/theme-engine.ts`，实现全局单例编排器与状态订阅能力。

## 2. 对外入口收敛

- [x] 2.1 重构 `packages/vi/src/composables/use-vi-theme.ts`，改为消费单例引擎并保持现有返回 API。
- [x] 2.2 重构 `packages/vi/src/theme/init-theme.ts`，固定为唯一配置入口并驱动首次初始化。
- [x] 2.3 增加 `syncDefaultViPrefix` 配置项，默认启用并在自定义前缀场景同步输出 `--vi-*`。
- [x] 2.4 为 `useViTheme(options)` 增加兼容期处理（仅迁移提示，不再作为长期配置入口）。
- [x] 2.5 增加 `defaultThemeKey` 配置项，仅用于无持久化值时的初始主题选择，保留“持久化值优先”策略。

## 3. 调用侧与文档对齐

- [x] 3.1 调整 Storybook 主题场景调用方式，移除将配置参数传入 `useViTheme` 的写法。
- [x] 3.2 更新 `docs/guides/theme-drawer.md` 与 `docs/guides/theme-drawer-integration.md`，明确初始化配置入口约束。
- [x] 3.3 在 OpenSpec 变更文档中补充迁移说明（兼容期、下一版本清理策略）。

## 4. 验证与回归

- [x] 4.1 执行 `pnpm build:vi`，确认库构建通过。
- [x] 4.2 执行 `pnpm build:storybook`，确认文档构建通过。
- [x] 4.3 验证 `Theme/Theme Drawer` 与 `Theme/Prototype Regression` 场景，确认主题切换与暗黑模式无行为回退。
- [x] 4.4 验证自定义前缀 + 默认兼容同步场景，确认 `--vi-*` 与自定义前缀变量同时可用。
