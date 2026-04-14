# 设计文档：VI 项目构建与 Storybook 优化

## 1. Storybook 读取模式控制设计

### 1.1 环境变量定义

**变量名**：`VI_SOURCE_MODE`

**可选值**：
- `true` 或未设置：源码模式
- `false`：构建模式

**优先级**：环境变量 > 默认值（源码模式）

### 1.2 Vite 配置修改

#### 1.2.1 Alias 配置

**源码模式**：
```typescript
{
  find: '@yyxxfe/vi/styles',
  replacement: path.join(viPackageRoot, 'src/index.ts')
},
{
  find: '@yyxxfe/vi',
  replacement: path.join(viPackageRoot, 'src/index.ts')
}
```

**构建模式**：
```typescript
{
  find: '@yyxxfe/vi/styles',
  replacement: path.join(viPackageRoot, 'dist/index.js')
},
{
  find: '@yyxxfe/vi',
  replacement: path.join(viPackageRoot, 'dist/index.js')
}
```

#### 1.2.2 fs.allow 配置

**源码模式**：允许访问 `viPackageRoot`（整个 vi 包源码）

**构建模式**：仅允许访问 `storybookAppRoot`（Storybook 应用根目录）

**实现代码**：
```typescript
const isSourceMode = process.env.VI_SOURCE_MODE !== 'false'
const prevAllow = viteConfig.server.fs.allow || []

viteConfig.server.fs.allow = isSourceMode
  ? [...prevAllow, storybookAppRoot, viPackageRoot]
  : [...prevAllow, storybookAppRoot]
```

### 1.3 NPM 脚本设计

在 `apps/storybook/package.json` 中添加：

```json
{
  "scripts": {
    "dev:source": "cross-env VI_SOURCE_MODE=true storybook dev -p 6006",
    "dev:dist": "cross-env VI_SOURCE_MODE=false pnpm build:vi && storybook dev -p 6006",
    "build:source": "cross-env VI_SOURCE_MODE=true storybook build",
    "build:dist": "cross-env VI_SOURCE_MODE=false pnpm build:vi && storybook build"
  }
}
```

**脚本说明**：
- `dev:source`：开发模式，读取源码，支持热更新
- `dev:dist`：生产模式，先构建 vi 库，然后读取构建产物
- `build:source`：使用源码构建静态文档
- `build:dist`：使用构建产物构建静态文档（适合生产部署）

### 1.4 启动日志

在 Storybook 启动时输出当前模式：

```typescript
console.log(`📚 Storybook 模式: ${isSourceMode ? '源码模式 (Source Mode)' : '构建模式 (Distribution Mode)'}`)
console.log(`📦 VI 库入口: ${isSourceMode ? viSourceEntry : viDistEntry}`)
```

## 2. VI 项目打包优化设计

### 2.1 Vite 配置优化

#### 2.1.1 多格式输出

修改 `packages/vi/vite.config.ts`：

```typescript
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        theme: resolve(__dirname, 'src/composables/use-vi-theme.ts'),
        'theme-drawer': resolve(__dirname, 'src/components/theme-drawer/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        return format === 'es' ? `${entryName}.js` : `${entryName}.cjs`
      },
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        '@element-plus/icons-vue',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          '@element-plus/icons-vue': 'ElementPlusIconsVue',
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      outDir: 'dist',
      insertTypesEntry: true,
      rollupTypes: true,
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
})
```

#### 2.1.2 依赖说明

新增插件：
- `vite-plugin-dts`：生成类型定义文件
- `rollup-plugin-visualizer`：构建分析

### 2.2 package.json 优化

#### 2.2.1 exports 配置

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "default": "./dist/index.js"
    },
    "./theme": {
      "types": "./dist/theme.d.ts",
      "import": "./dist/theme.js",
      "require": "./dist/theme.cjs"
    },
    "./theme-drawer": {
      "types": "./dist/theme-drawer.d.ts",
      "import": "./dist/theme-drawer.js",
      "require": "./dist/theme-drawer.cjs"
    },
    "./styles": "./dist/style.css"
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist"
  ],
  "publishConfig": {
    "access": "public"
  }
}
```

#### 2.2.2 peerDependencies 配置

```json
{
  "peerDependencies": {
    "vue": "^3.0.0",
    "element-plus": "^2.0.0"
  },
  "peerDependenciesMeta": {
    "element-plus": {
      "optional": true
    }
  }
}
```

### 2.3 文件结构

优化后的 dist 目录结构：

```
packages/vi/dist/
├── index.js              # ESM 主入口
├── index.cjs             # CJS 主入口
├── index.d.ts            # 类型定义
├── theme.js              # ESM 主题入口
├── theme.cjs             # CJS 主题入口
├── theme.d.ts            # 主题类型定义
├── theme-drawer.js       # ESM 抽屉入口
├── theme-drawer.cjs      # CJS 抽屉入口
├── theme-drawer.d.ts     # 抽屉类型定义
├── style.css             # 样式文件
├── stats.html            # 构建分析报告
└── components/           # 按需导入的组件
```

## 3. 使用方指南

### 3.1 安装

```bash
npm install @yyxxfe/vi
# 或
pnpm add @yyxxfe/vi
```

### 3.2 ESM 项目使用

```javascript
import { initViTheme, ThemeDrawer, useViTheme } from '@yyxxfe/vi'
import '@yyxxfe/vi/styles'

// 初始化
initViTheme({
  elementPlus: ElementPlus,
  theme: 'blue',
  mode: 'light'
})
```

### 3.3 CJS 项目使用

```javascript
const { initViTheme, ThemeDrawer, useViTheme } = require('@yyxxfe/vi')
require('@yyxxfe/vi/styles')

// 初始化
initViTheme({
  elementPlus: ElementPlus,
  theme: 'blue',
  mode: 'light'
})
```

### 3.4 按需导入

```javascript
// 仅导入主题组合式 API
import { useViTheme } from '@yyxxfe/vi/theme'

// 仅导入 ThemeDrawer 组件
import ThemeDrawer from '@yyxxfe/vi/theme-drawer'
```

## 4. 测试策略

### 4.1 Storybook 双模式验证

1. **源码模式测试**
   ```bash
   cd apps/storybook
   pnpm dev:source
   ```
   - 验证所有组件正常渲染
   - 验证主题切换功能
   - 验证类型提示正常

2. **构建模式测试**
   ```bash
   cd apps/storybook
   pnpm dev:dist
   ```
   - 验证打包产物与源码行为一致
   - 验证所有组件正常渲染
   - 验证主题切换功能

### 4.2 类型定义测试

```bash
cd packages/vi
pnpm build
tsc --noEmit  # 验证类型定义正确性
```

### 4.3 包体积分析

构建完成后检查 `dist/stats.html`：
- 确认没有意外打包的依赖
- 确认按需导入生效
- 确认压缩后体积合理

### 4.4 多格式兼容性测试

创建测试项目验证：
- ESM 项目能正常导入
- CJS 项目能正常导入
- TypeScript 类型提示正常
- 运行时无错误

## 5. 兼容性说明

### 5.1 破坏性变更

- **无**：本次优化向后兼容
- 新增 CJS 支持，不影响现有 ESM 使用方

### 5.2 迁移路径

现有使用方无需修改代码即可升级。

可选优化：
- 如果使用方之前通过 `import X from '@yyxxfe/vi/src'` 访问源码，建议改为官方导出路径

## 6. 后续优化方向

1. **Tree Shaking 优化**：进一步减小包体积
2. **CSS-in-JS 支持**：按需注入 CSS
3. **Sass/Less 支持**：支持样式预处理
4. **自动化测试**：添加单元测试和 E2E 测试
5. **CI/CD 集成**：自动化构建和发布流程
