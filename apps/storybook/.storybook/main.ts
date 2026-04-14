/**
 * Storybook 主配置文件
 * 定义故事路径、插件、框架等核心配置
 */

import type { StorybookConfig } from "@storybook/vue3-vite";
import { createViteFinalConfig } from "./vite-config";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|js|jsx|mjs)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: createViteFinalConfig,
};

export default config;


