import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import type { StorybookConfig } from '@storybook/vue3-vite'

const storybookDir = path.dirname(fileURLToPath(import.meta.url))
/** Storybook 应用根（`src/stories` 等），避免因自定义 allow 收窄导致 403 */
const storybookAppRoot = path.resolve(storybookDir, '..')
/** 仓库根：与工作区内源码 alias 一致，供 Vite 放行读盘 */
const repoRoot = path.resolve(storybookDir, '../../..')
const viPackageRoot = path.join(repoRoot, 'packages/vi')
const viMainEntry = path.join(viPackageRoot, 'src/index.ts')

const viDevAliases = [
  { find: '@yyxxfe/vi/styles', replacement: viMainEntry },
  { find: '@yyxxfe/vi', replacement: viMainEntry },
] as const

function mergeViteAlias(
  existing: import('vite').ResolveOptions['alias']
): import('vite').ResolveOptions['alias'] {
  if (Array.isArray(existing)) {
    return [...viDevAliases, ...existing]
  }
  if (existing && typeof existing === 'object') {
    return [
      ...viDevAliases,
      ...Object.entries(existing).map(([find, replacement]) => ({
        find,
        replacement: replacement as string,
      })),
    ]
  }
  return [...viDevAliases]
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx|mjs)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), vue()]
    viteConfig.resolve = viteConfig.resolve ?? {}
    viteConfig.resolve.alias = mergeViteAlias(viteConfig.resolve.alias)

    const prevAllow = viteConfig.server?.fs?.allow ?? []
    viteConfig.server = viteConfig.server ?? {}
    viteConfig.server.fs = {
      ...viteConfig.server.fs,
      allow: [...prevAllow, storybookAppRoot, repoRoot],
    }

    return viteConfig
  },
}

export default config
