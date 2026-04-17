import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],

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
        // ESM 输出
        {
          format: "es",
          entryFileNames: "[name].js",
          assetFileNames(assetInfo) {
            if (assetInfo.name?.endsWith(".css")) {
              // index.css → style.css，其他保持原名
              const baseName = assetInfo.name.replace(/\.css$/, "");
              if (baseName === "index") {
                return "style[extname]";
              }
              return "[name][extname]";
            }
            return "assets/[name][extname]";
          },
          preserveModules: false,
        },
        // CJS 输出
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          assetFileNames(assetInfo) {
            // CJS 输出不重复生成 CSS，CSS 只由 ESM 产出
            if (assetInfo.name?.endsWith(".css")) {
              const baseName = assetInfo.name.replace(/\.css$/, "");
              if (baseName === "index") {
                return "style[extname]";
              }
              return "[name][extname]";
            }
            return "assets/[name][extname]";
          },
          preserveModules: false,
        },
      ],
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
