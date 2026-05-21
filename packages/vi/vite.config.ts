import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const assetFileNames = (assetInfo) => {
  if (assetInfo.names[0].endsWith(".css")) {
    // index.css → style.css，其他保持原名
    const baseName = assetInfo.names[0].replace(/\.css$/, "");
    if (baseName === "index") {
      return "style[extname]";
    }
    return "[name][extname]";
  }
  return "assets/[name][extname]";
};

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
          assetFileNames: assetFileNames,
          preserveModules: false,
        },
        // CJS 输出
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          assetFileNames: assetFileNames,
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
