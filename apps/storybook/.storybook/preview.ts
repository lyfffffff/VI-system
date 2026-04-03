import type { Decorator, Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { initViTheme, useViTheme } from '@yyxxfe/vi'
import '@yyxxfe/vi/styles'
import './preview.css'
import './preview.stories.css'

setup((app) => {
  app.use(ElementPlus)
  initViTheme({ prefix: 'vi' })
})

function applyStorybookMode(mode: 'light' | 'dark'): void {
  const { setDark, applyTheme } = useViTheme()
  setDark(mode === 'dark')
  applyTheme()
}

const withThemeMode: Decorator = (storyFn, context) => {
  const mode = context.globals.themeMode === 'dark' ? 'dark' : 'light'
  applyStorybookMode(mode)
  return storyFn()
}

const preview: Preview = {
  globalTypes: {
    themeMode: {
      name: '主题模式',
      description: '控制 Storybook 预览区（包含 Docs）的深浅色模式',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          { value: 'light', title: '浅色' },
          { value: 'dark', title: '暗黑' },
        ],
      },
    },
  },
  decorators: [withThemeMode],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
