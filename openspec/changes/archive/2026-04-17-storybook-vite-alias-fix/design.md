# VI 构建配置与 Storybook 别名修复

## 背景

VI 库需要支持双入口打包（通用样式 + Workbench 模块样式），Storybook 需要支持双模式（源码模式/构建模式）运行。

## 一、VI 库打包配置

### 双入口打包策略

| 入口 | 源文件 | 输出 CSS | 用途 |
|---|---|---|---|
| index | `src/index.ts` | `style.css` | 通用样式（tokens + semantic-vars + element-plus-mapping） |
| element-plus | `src/element-plus.ts` | `element-plus.css` | Element Plus 组件样式覆盖 |
| workbench | `src/workbench.ts` | `workbench.css` | Workbench 模块样式 |

### 入口文件内容

**`src/index.ts`** - 主入口，包含主题能力导出和通用样式：

```typescript
// 第一层：基础令牌，注入 --vi-* 变量
import './styles/index.less';

// 组件样式：聚合到主入口，用户只需导入 @yyxxfe/vi/styles
import './components/theme-drawer/index.less';

export { initViTheme, useViTheme, THEME_PRESETS, DEFAULT_THEME, getThemeVariants } from "./...";
export type { ThemeColorKey, IThemePreset, ... } from "./types/theme";
export { default as ThemeDrawer } from "./components/theme-drawer";
```

**`src/element-plus.ts`** - Element Plus 样式覆盖入口：

```typescript
// 第二层：注入 --el-* 变量 + EP 组件样式覆盖
// 使用前需确保已导入 @yyxxfe/vi/styles（提供 --vi-* 变量）
import './styles/element-plus-mapping.less';
import './styles/element-ui/index.less';
```

**`src/workbench.ts`** - Workbench 模块样式入口：

```typescript
// 第二层：注入 --wb-* 变量 + Workbench 业务样式
// 使用前需确保已导入 @yyxxfe/vi/styles（提供 --vi-* 变量）
import './styles/workbench-mapping.less';
import './styles/workbench/index.less';
```

### vite.config.ts 配置

```typescript
export default defineConfig({
  build: {
    outDir: "dist",
    cssCodeSplit: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        "element-plus": path.resolve(__dirname, "src/element-plus.ts"),
        workbench: path.resolve(__dirname, "src/workbench.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue", "element-plus", "@element-plus/icons-vue"],
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
          assetFileNames(assetInfo) {
            if (assetInfo.name?.endsWith(".css")) {
              const baseName = assetInfo.name.replace(/\.css$/, "");
              // index.css → style.css
              if (baseName === "index") return "style[extname]";
              return "[name][extname]";
            }
            return "assets/[name][extname]";
          },
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          assetFileNames(assetInfo) {
            // CJS 输出不重复生成 CSS
            if (assetInfo.name?.endsWith(".css")) {
              const baseName = assetInfo.name.replace(/\.css$/, "");
              if (baseName === "index") return "style[extname]";
              return "[name][extname]";
            }
            return "assets/[name][extname]";
          },
        },
      ],
    },
  },
});
```

### 构建产物

```
dist/
├── index.js          # ESM 主入口
├── index.cjs         # CJS 主入口
├── element-plus.js   # ESM EP 样式入口
├── element-plus.cjs  # CJS EP 样式入口
├── workbench.js      # ESM Workbench 样式入口
├── workbench.cjs     # CJS Workbench 样式入口
├── style.css         # 通用样式
├── element-plus.css  # EP 组件样式覆盖
└── workbench.css     # Workbench 业务样式
```

---

## 二、Storybook 双模式配置

### 双模式设计

| 模式 | DOC_ENV | 数据来源 | 用途 |
|---|---|---|---|
| 源码模式 | development | `packages/vi/src/` | 开发调试，热更新 |
| 构建模式 | production | `packages/vi/dist/` | 验证构建产物 |

### 问题根因

运行时报错 `Failed to fetch dynamically imported module: http://localhost:6006/.storybook/preview.ts`，由以下问题导致：

#### 问题1：别名逻辑与文件访问权限不匹配

| 模式 | 原别名配置 | 原 fs.allow 配置 | 结果 |
|---|---|---|---|
| 源码模式 | 不设别名 | 包含 viPackageRoot | 无法访问源码 |
| 构建模式 | 设别名指向源码 | 不包含 viPackageRoot | 权限拒绝 |

**矛盾**：构建模式设了别名指向源码，但 fs.allow 不允许访问源码目录。

#### 问题2：样式别名指向错误的文件类型

| 导入路径 | 期望类型 | 错误指向 | 正确指向 |
|---|---|---|---|
| `@yyxxfe/vi/styles` | Less/CSS | `src/index.ts` | `src/styles/index.less` |

#### 问题3：缺少主入口别名

`preview.ts` 导入了 `@yyxxfe/vi`（主入口），但别名配置中只有样式路径。

#### 问题4：别名顺序错误

```
@yyxxfe/vi           ← 先匹配
@yyxxfe/vi/styles    ← 永远不会被匹配到
```

### 解决方案

#### 1. path.ts - 定义源码入口路径

```typescript
// VI 库 JS 主入口文件路径（源码模式）
export const viSourceEntry = path.join(viPackageRoot, "src/index.ts");

// VI 库通用样式入口文件路径（源码模式，.less 文件）
export const viStylesEntry = path.join(viPackageRoot, "src/styles/index.less");

// VI 库 Element Plus 样式入口文件路径（源码模式）
export const viElementPlusEntry = path.join(viPackageRoot, "src/element-plus.ts");

// VI 库 Workbench 样式入口文件路径（源码模式）
export const viWorkbenchEntry = path.join(viPackageRoot, "src/workbench.ts");
```

#### 2. vite-config.ts - 别名配置

```typescript
const isDev = process.env.DOC_ENV !== "production";

/**
 * 开发模式（isDev=true）：用源码别名 + 允许访问 vi 源码目录 → 支持热更新
 * 生产模式（isDev=false）：不设别名 + 不需要 vi 源码访问 → 使用构建产物 dist
 */
const alias = [
  ...(isDev
    ? [
        // 注意：更具体的路径必须放在前面，否则会被 @yyxxfe/vi 先匹配
        { find: "@yyxxfe/vi/styles/element-plus", replacement: viElementPlusEntry },
        { find: "@yyxxfe/vi/styles/workbench", replacement: viWorkbenchEntry },
        { find: "@yyxxfe/vi/styles", replacement: viStylesEntry },
        { find: "@yyxxfe/vi", replacement: viSourceEntry },
      ]
    : []),
] as const;

// fs.allow 配置
server: {
  fs: {
    allow: isDev
      ? [...prevAllow, storybookAppRoot, viPackageRoot]  // 源码模式：允许访问 vi 源码
      : [...prevAllow, storybookAppRoot],                // 构建模式：只需 storybook 目录
  },
}
```

### 关键修复点

1. **别名逻辑对齐**：源码模式设别名 + 允许访问源码目录
2. **样式入口正确**：`@yyxxfe/vi/styles` → `.less` 文件而非 `.ts` 文件
3. **主入口别名**：补充 `@yyxxfe/vi` 别名
4. **别名顺序**：更具体的路径放前面，避免被截获

---

## 涉及文件

**VI 库打包：**
- `packages/vi/vite.config.ts`
- `packages/vi/src/index.ts`
- `packages/vi/src/element-plus.ts`
- `packages/vi/src/workbench.ts`

**Storybook 配置：**
- `apps/storybook/.storybook/vite-config.ts`
- `apps/storybook/.storybook/path.ts`

## 验证

```bash
# 构建 VI 库
pnpm build:vi

# 源码模式
pnpm --filter @vi/storybook dev

# 构建模式
pnpm --filter @vi/storybook dev:prod
```
