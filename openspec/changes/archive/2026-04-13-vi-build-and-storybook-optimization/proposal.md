# 提案：VI 项目构建与 Storybook 优化

## 问题背景

### 当前问题

1. **Storybook 读取模式单一**
   - 当前 Storybook 只能读取 vi 库的源码模式
   - 无法验证打包后的产物是否符合预期
   - 开发时无法切换到生产构建模式进行测试

2. **VI 项目打包配置不完善**
   - 仅输出 ESM 格式，缺少 CJS 支持
   - 类型定义（.d.ts）未自动生成
   - package.json 的 exports 配置不完整，types 字段错误指向源码
   - 缺少构建分析和压缩优化
   - 外部依赖（peerDependencies）未正确配置

### 影响范围

- 开发体验：无法快速验证打包产物
- 使用方兼容性：不支持 CommonJS 项目
- 类型安全：类型定义缺失或错误
- 包体积：缺少压缩和优化
- 维护成本：缺少构建分析工具

## 解决方案

### 1. Storybook 读取模式控制

**方案概述**：
引入环境变量 `VI_SOURCE_MODE` 控制 Storybook 读取 vi 库源码或打包产物。

**核心机制**：
- `VI_SOURCE_MODE=true`（默认）：读取 `packages/vi/src/` 源码
- `VI_SOURCE_MODE=false`：读取 `packages/vi/dist/` 打包产物

**实现要点**：
1. 修改 `apps/storybook/.storybook/main.ts` 的 Vite alias 配置
2. 调整 `fs.allow` 权限以支持不同模式
3. 在 `apps/storybook/package.json` 添加便捷脚本

### 2. VI 项目打包优化

**优化维度**：

#### 2.1 多格式输出
- 同时输出 ESM 和 CJS 格式
- 文件命名规范：`index.js` (ESM) / `index.cjs` (CJS)

#### 2.2 TypeScript 类型定义
- 自动生成 .d.ts 文件
- 配置 package.json 的 types 字段指向编译产物

#### 2.3 完整的 exports 配置
- 为每个入口提供 types/import/require/default
- 添加 styles 入口导出

#### 2.4 依赖外部化
- 配置 peerDependencies
- 在 build.rollupOptions.external 中声明

#### 2.5 构建优化
- 启用代码压缩（terser）

#### 2.6 CSS 处理优化
- 确保样式正确提取和注入
- 优化 CSS 变量处理

## 预期收益

1. **开发体验提升**
   - 可快速切换源码/构建模式进行验证
   - 通过不同脚本启动不同模式

2. **兼容性增强**
   - 同时支持 ESM 和 CJS 项目
   - 完整的类型定义支持

3. **发布质量保障**
   - 能在 Storybook 中验证打包产物

4. **使用方友好**
   - 清晰的导出路径
   - 标准的 npm 包结构

## 风险与缓解

### 风险点

1. **环境变量切换可能带来混乱**
   - 缓解：在启动日志中明确显示当前模式

2. **构建产物与源码行为不一致**
   - 缓解：通过 Storybook 双模式验证确保一致性

3. **CJS 兼容性测试不足**
   - 缓解：在变更集中明确测试要求

## 实施计划

详见 `design.md`（设计文档）和 `tasks.md`（任务列表）。
