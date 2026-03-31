Role: 你是一位资深前端架构师，精通组件库工程化与跨技术栈样式适配。

Task: 请根据以下需求，输出一套基于 Less 开发的 VI（视觉规范）公共库架构方案。

1. 技术上下文与选型

VI 库开发语言：Vue 3 + TS + Vite + Less。

UI 基础：Element Plus（需通过 CSS 变量深度适配其主题）。

文档/预览：Histoire (Vite 原生驱动)。

分发：GitLab NPM Registry 私有包。

2. 架构设计要求（核心输出）

CSS 变量中转策略（The Variable Hub）：

在 VI 库内使用 Less 定义基础 Token，但必须编译输出为一套标准的 CSS Variables（如 --vi-color-primary）。

Element Plus 同步逻辑：

展示如何在 index.css 中将 --el-color-primary 等变量映射到 --vi-color-primary。

3. 工程化交付

Package.json 导出设计：使用 exports 字段定义多入口，支持 import "@yyxxfe/vi/scss" 或 import "@yyxxfe/vi/less"。

Histoire 交互设计：如何在 Histoire 侧边栏通过控制台实时修改 CSS 变量，并演示不同技术栈组件的视觉同步。

4. 约束规则

逻辑一致性：确保 Less 计算逻辑（如 fade() 或 darken()）在编译成 CSS 变量前处理完成，或寻找 CSS color-mix() 替代方案。

零魔法数：所有间距、圆角、阴影必须映射至 Token。

输入参考：

业务原型：https://askdata-dashboard.pages.dev/data-cockpit

本地环境：F:\web_git_frontend\ask-data

请先输出：VI 库的目录结构、项目的生成思路。
