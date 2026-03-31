import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ThemeDrawer, THEME_PRESETS, useViTheme } from '@yyxxfe/vi'
import type { ThemeColorKey } from '@yyxxfe/vi'

const meta: Meta = {
  title: 'Theme/Prototype Regression',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '高保真原型回归场景：导航、筛选条、指标卡、图表容器、表格、弹层。在亮/暗与多主题色下验证视觉契约。',
      },
    },
  },
}

export default meta

type Story = StoryObj

export const DataCockpitPrototype: Story = {
  render: () => ({
    components: { ThemeDrawer },
    setup() {
      const drawerOpen = ref(false)
      const dialogOpen = ref(false)
      const period = ref('day')
      const shortcut = ref('today')
      const reportDate = ref('2026-03-30')
      const channel = ref('all-release')
      const game = ref('all-game')
      const app = ref('all-app')
      const chartMetric = ref('revenue')
      const chartVersion = ref('stable')

      const { themeKey, isDark, setTheme, setDark, applyTheme } = useViTheme({ prefix: 'vi' })
      applyTheme()

      const navItems = [
        { key: 'ops', label: '经营分析' },
        { key: 'game', label: '游戏分析' },
        { key: 'market', label: '竞品监控' },
      ]
      const activeNav = ref('ops')

      const sidebarGroups = [
        {
          title: '数据模型',
          active: true,
          items: [
            { key: 'forecast', label: '经营预测', active: false },
            { key: 'income', label: '收入数据', active: true },
            { key: 'analysis', label: '收入分析', active: false },
          ],
        },
        {
          title: '基础数据',
          active: false,
          items: [
            { key: 'overview', label: '基础概览', active: false },
            { key: 'new', label: '新增账号', active: false },
          ],
        },
      ]

      const tags = [
        { key: 'cockpit', label: '数据驾驶舱', active: true },
        { key: 'forecast', label: '经营预测', active: false },
        { key: 'income', label: '收入数据', active: false },
      ]

      const metrics = [
        { title: '流水(元)', value: '757万', mom: '-19.9%', yoy: '-5.2%' },
        { title: '收入(元)', value: '530万', mom: '-18.5%', yoy: '-3.8%' },
        { title: '消耗(元)', value: '446万', mom: '-0.2%', yoy: '+2.1%' },
        { title: '销售毛利润(元)', value: '72万', mom: '+15.3%', yoy: '+8.5%' },
        { title: '首日ROI', value: '5.23%', mom: '-2.1%', yoy: '+1.2%' },
        { title: '注册单价(元)', value: '362.09', mom: '-3.5%', yoy: '-5.2%' },
      ]

      const tableData = [
        { game: '伏魔', account: '国内投放A组', revenue: '1,092,301', roi: '3.61', status: '正常' },
        { game: '永恒之门', account: '海外投放B组', revenue: '892,170', roi: '3.54', status: '波动' },
      ]

      function trendClass(value: string): string {
        return value.startsWith('+') ? 'is-up' : 'is-down'
      }

      function statusType(status: string): 'success' | 'info' {
        return status === '正常' ? 'success' : 'info'
      }

      const themeOptions = computed(() =>
        THEME_PRESETS.map((item) => ({
          label: item.name,
          value: item.key,
        })),
      )

      function changeTheme(value: ThemeColorKey): void {
        setTheme(value)
      }

      return {
        drawerOpen,
        dialogOpen,
        period,
        shortcut,
        reportDate,
        channel,
        game,
        app,
        chartMetric,
        chartVersion,
        themeKey,
        isDark,
        setDark,
        changeTheme,
        themeOptions,
        navItems,
        activeNav,
        sidebarGroups,
        tags,
        metrics,
        tableData,
        trendClass,
        statusType,
      }
    },
    template: `
      <div class="story-root vi-theme-scope prototype-regression-story">
        <div class="prototype-regression-story__toolbar">
          <el-switch
            :model-value="isDark"
            inline-prompt
            active-text="暗"
            inactive-text="亮"
            @update:model-value="setDark"
          />
          <el-select :model-value="themeKey" style="width: 160px" @update:model-value="changeTheme">
            <el-option v-for="opt in themeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <el-button type="primary" class="sb-no-flex-stretch" @click="drawerOpen = true">主题设置</el-button>
          <el-button class="sb-no-flex-stretch" @click="dialogOpen = true">打开弹窗</el-button>
        </div>

        <div class="workbench-shell">
          <header class="workbench-topbar">
            <div class="workbench-topbar__left">
              <div class="workbench-topbar__brand">天问 · 数据平台</div>
              <nav class="workbench-topbar__nav">
                <button
                  v-for="item in navItems"
                  :key="item.key"
                  type="button"
                  class="workbench-topbar__nav-item"
                  :class="{ 'is-active': activeNav === item.key }"
                  @click="activeNav = item.key"
                >
                  {{ item.label }}
                </button>
              </nav>
            </div>
            <div class="workbench-topbar__actions">
              <el-button type="primary" class="sb-no-flex-stretch">AI助手</el-button>
              <el-avatar :size="30">D</el-avatar>
            </div>
          </header>

          <div class="workbench-shell__body">
            <aside class="workbench-sidebar">
              <div v-for="group in sidebarGroups" :key="group.title" style="margin-bottom: 10px;">
                <div class="workbench-sidebar__group-title" :class="{ 'has-active': group.active }">{{ group.title }}</div>
                <button
                  v-for="item in group.items"
                  :key="item.key"
                  type="button"
                  class="workbench-sidebar__item"
                  :class="{ 'is-active': item.active }"
                >
                  {{ item.label }}
                </button>
              </div>
            </aside>

            <main class="workbench-shell__main">
              <div class="workbench-tags-view">
                <button
                  v-for="tag in tags"
                  :key="tag.key"
                  type="button"
                  class="workbench-tag"
                  :class="{ 'is-active': tag.active }"
                >
                  {{ tag.label }}
                </button>
              </div>

              <section class="workbench-filter wb-soft-panel">
                <div class="workbench-filter__header">
                  <div class="workbench-filter__title">数据驾驶舱</div>
                  <div class="workbench-filter__actions">
                    <el-select v-model="channel" class="workbench-filter__field--channel">
                      <el-option label="全部发行" value="all-release" />
                      <el-option label="仅国内" value="cn" />
                    </el-select>
                    <el-select v-model="game" class="workbench-filter__field--game">
                      <el-option label="全部游戏" value="all-game" />
                      <el-option label="伏魔" value="fumo" />
                    </el-select>
                    <el-select v-model="app" class="workbench-filter__field--app">
                      <el-option label="全部应用" value="all-app" />
                      <el-option label="iOS" value="ios" />
                    </el-select>
                  </div>
                </div>

                <div class="workbench-filter__time-bar">
                  <el-radio-group v-model="period" class="dimension-radio-group">
                    <el-radio-button label="day">日</el-radio-button>
                    <el-radio-button label="week">周</el-radio-button>
                    <el-radio-button label="month">月</el-radio-button>
                    <el-radio-button label="year">年</el-radio-button>
                  </el-radio-group>

                  <div class="time-shortcut-group">
                    <el-button
                      class="shortcut-btn sb-no-flex-stretch"
                      :type="shortcut === 'today' ? 'primary' : 'default'"
                      @click="shortcut = 'today'"
                    >今日</el-button>
                    <el-button
                      class="shortcut-btn sb-no-flex-stretch"
                      :type="shortcut === 'yesterday' ? 'primary' : 'default'"
                      @click="shortcut = 'yesterday'"
                    >昨日</el-button>
                  </div>

                  <el-date-picker
                    v-model="reportDate"
                    type="date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="workbench-filter__field--date-range"
                  />
                </div>
              </section>

              <section class="workbench-metrics">
                <article v-for="metric in metrics" :key="metric.title" class="workbench-metric-card" data-numeric="true">
                  <div class="workbench-metric-card__title">{{ metric.title }}</div>
                  <div class="workbench-metric-card__value">{{ metric.value }}</div>
                  <div class="workbench-metric-card__footer">
                    <span :class="['workbench-metric-card__trend', trendClass(metric.mom)]">环比 {{ metric.mom }}</span>
                    <span :class="['workbench-metric-card__trend', trendClass(metric.yoy)]">同比 {{ metric.yoy }}</span>
                  </div>
                </article>
              </section>

              <section class="workbench-chart-panel">
                <div class="workbench-chart-panel__header">
                  <h3 class="workbench-chart-panel__title">游戏趋势</h3>
                  <div class="workbench-filter__actions">
                    <el-select v-model="chartMetric" style="width: 160px;">
                      <el-option label="流水" value="revenue" />
                      <el-option label="收入" value="income" />
                    </el-select>
                    <el-select v-model="chartVersion" style="width: 180px;">
                      <el-option label="伏魔主版本" value="stable" />
                      <el-option label="测试版本" value="test" />
                    </el-select>
                  </div>
                </div>

                <div class="workbench-chart-mock">
                  <div class="workbench-chart-mock__line workbench-chart-mock__line--primary"></div>
                  <div class="workbench-chart-mock__line workbench-chart-mock__line--comparison"></div>
                  <div class="workbench-chart-mock__line workbench-chart-mock__line--accent"></div>
                </div>
                <div class="workbench-chart-panel__legend">
                  <span>伏魔主版本</span>
                  <span>仙遇主版本</span>
                  <span>源星战域</span>
                </div>
              </section>

              <section class="wb-soft-panel" style="padding: 14px;">
                <el-table :data="tableData" style="width: 100%;">
                  <el-table-column prop="game" label="游戏" />
                  <el-table-column prop="account" label="账户" />
                  <el-table-column prop="revenue" label="收入" />
                  <el-table-column prop="roi" label="ROI" />
                  <el-table-column label="状态">
                    <template #default="scope">
                      <el-tag :type="statusType(scope.row.status)" effect="light" round>{{ scope.row.status }}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </section>
            </main>
          </div>
        </div>

        <el-dialog v-model="dialogOpen" title="弹窗样式回归" width="520px">
          <el-input v-model="reportDate" />
          <template #footer>
            <div class="dialog-footer-actions">
              <el-button @click="dialogOpen = false">取消</el-button>
              <el-button type="primary" @click="dialogOpen = false">确认</el-button>
            </div>
          </template>
        </el-dialog>

        <ThemeDrawer v-model:open="drawerOpen" />
      </div>
    `,
  }),
}
