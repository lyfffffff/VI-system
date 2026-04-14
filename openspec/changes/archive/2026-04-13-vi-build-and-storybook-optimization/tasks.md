# 任务列表：VI 项目构建与 Storybook 优化

## 阶段 1：依赖安装

- [ ] 安装 vite-plugin-dts
  ```bash
  cd packages/vi
  pnpm add -D vite-plugin-dts
  ```

- [ ] 安装 rollup-plugin-visualizer
  ```bash
  cd packages/vi
  pnpm add -D rollup-plugin-visualizer
  ```

- [ ] 安装 cross-env（用于跨平台环境变量设置）
  ```bash
  cd apps/storybook
  pnpm add -D cross-env
  ```

## 阶段 2：VI 项目打包优化

### Vite 配置修改

- [ ] 修改 `packages/vi/vite.config.ts`，添加多格式输出
  - 修改 `formats` 为 `['es', 'cjs']`
  - 配置 `fileName` 函数

- [ ] 配置 `rollupOptions.external`
  - 添加外部依赖：`vue`, `element-plus`, `@element-plus/icons-vue`
  - 配置 `globals` 映射

- [ ] 添加代码压缩配置
  - 设置 `minify: 'terser'`
  - 配置 `terserOptions`

- [ ] 集成 `vite-plugin-dts`
  - 配置类型定义生成
  - 设置输出目录为 `dist`

- [ ] 集成 `rollup-plugin-visualizer`
  - 配置构建分析输出
  - 启用 gzip 和 brotli 大小计算

### package.json 修改

- [ ] 修改 `packages/vi/package.json` 的 exports 配置
  - 修正 `types` 字段指向 `./dist/index.d.ts`
  - 为每个入口添加 `import` 和 `require` 字段
  - 添加 `default` 字段

- [ ] 添加 `./styles` 导出

- [ ] 配置 `peerDependencies`
  - 添加 `vue` 和 `element-plus`
  - 配置 `peerDependenciesMeta`

- [ ] 添加 `main`, `module`, `types` 字段

- [ ] 添加 `files` 字段指定发布内容

- [ ] 添加 `publishConfig`

### 构建脚本优化

- [ ] 更新 `packages/vi/package.json` 的 build 脚本
  ```json
  "build": "vite build",
  "build:analyze": "vite build && open dist/stats.html"
  ```

### 验证构建产物

- [ ] 执行构建并验证输出文件
  ```bash
  cd packages/vi
  pnpm build
  ```

- [ ] 验证 ESM 文件生成（`index.js`, `theme.js`, `theme-drawer.js`）

- [ ] 验证 CJS 文件生成（`index.cjs`, `theme.cjs`, `theme-drawer.cjs`）

- [ ] 验证类型定义文件生成（`*.d.ts`）

- [ ] 检查构建分析报告（`dist/stats.html`）

- [ ] 验证样式文件（`style.css`）

### TypeScript 验证

- [ ] 运行类型检查
  ```bash
  cd packages/vi
  tsc --noEmit
  ```

## 阶段 3：Storybook 模式控制

### 配置文件修改

- [ ] 修改 `apps/storybook/.storybook/main.ts`
  - 读取 `VI_SOURCE_MODE` 环境变量
  - 根据变量值配置不同的 alias
  - 调整 `fs.allow` 权限

- [ ] 添加启动日志输出

### NPM 脚本添加

- [ ] 修改 `apps/storybook/package.json`，添加以下脚本：
  ```json
  "dev:source": "cross-env VI_SOURCE_MODE=true storybook dev -p 6006",
  "dev:dist": "cross-env VI_SOURCE_MODE=false pnpm build:vi && storybook dev -p 6006",
  "build:source": "cross-env VI_SOURCE_MODE=true storybook build",
  "build:dist": "cross-env VI_SOURCE_MODE=false pnpm build:vi && storybook build"
  ```

- [ ] 更新根目录的 build:vi 脚本（如果需要）

### 验证源码模式

- [ ] 启动源码模式
  ```bash
  cd apps/storybook
  pnpm dev:source
  ```

- [ ] 验证启动日志显示"源码模式"

- [ ] 验证所有组件正常渲染

- [ ] 验证主题切换功能

- [ ] 验证热更新正常工作

### 验证构建模式

- [ ] 启动构建模式
  ```bash
  cd apps/storybook
  pnpm dev:dist
  ```

- [ ] 验证启动日志显示"构建模式"

- [ ] 验证所有组件正常渲染

- [ ] 验证主题切换功能

- [ ] 验证与源码模式行为一致

## 阶段 4：使用方文档

- [ ] 更新 `packages/vi/README.md`
  - 添加安装说明
  - 添加 ESM 使用示例
  - 添加 CJS 使用示例
  - 添加按需导入示例

- [ ] 更新项目根目录 `README.md`
  - 添加项目构建说明
  - 添加 Storybook 启动说明

## 阶段 5：测试验证

### 集成测试

- [ ] 在源码模式下运行完整测试流程

- [ ] 在构建模式下运行完整测试流程

- [ ] 对比两种模式下的行为差异

- [ ] 确认无破坏性变更

### 性能测试

- [ ] 对比优化前后的构建产物体积

- [ ] 检查构建分析报告，确认优化效果

- [ ] 验证 Tree Shaking 生效

### 兼容性测试

- [ ] 在 ESM 项目中测试导入

- [ ] 在 CJS 项目中测试导入

- [ ] 在 TypeScript 项目中测试类型提示

- [ ] 在不同浏览器中测试运行时行为

## 阶段 6：文档归档

- [ ] 更新 `openspec/changes/vi-build-and-storybook-optimization/implementation-report.md`
  - 记录实施过程
  - 记录遇到的问题和解决方案
  - 记录测试结果

- [ ] 归档变更集到 `openspec/changes/archive/`

- [ ] 更新相关规范文档（如有需要）

## 完成标准

### 必须完成

- [ ] 所有构建产物正常生成
- [ ] 所有类型定义正确
- [ ] Storybook 两种模式均正常工作
- [ ] 通过所有测试用例
- [ ] 文档完整且准确

### 可选完成

- [ ] 构建分析报告优化
- [ ] 额外的性能优化
- [ ] 自动化测试覆盖
- [ ] CI/CD 集成

## 风险提示

⚠️ **重要提示**：
1. 修改 package.json exports 字段会影响包的导入方式，请谨慎测试
2. 添加 peerDependencies 需要通知使用者更新依赖
3. 构建产物路径变更可能导致使用方需要更新代码
4. 建议在测试环境充分验证后再发布到生产环境

## 时间估算

- 阶段 1（依赖安装）：10 分钟
- 阶段 2（VI 打包优化）：1-2 小时
- 阶段 3（Storybook 控制）：1 小时
- 阶段 4（文档更新）：30 分钟
- 阶段 5（测试验证）：1-2 小时
- 阶段 6（文档归档）：30 分钟

**总计**：约 4-6 小时
