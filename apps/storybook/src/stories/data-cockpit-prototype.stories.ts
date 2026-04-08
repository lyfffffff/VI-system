// 驾驶舱原型 Story：用于验证 data-cockpit 关键模块在主题系统下的视觉一致性。
import type { Meta, StoryObj } from "@storybook/vue3";
import DataCockpitPrototypeView from "./data-cockpit-prototype/data-cockpit-prototype.vue";

const meta: Meta = {
  title: "主题/驾驶舱原型",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "高保真原型驾驶舱：导航、筛选条、指标卡、图表容器、表格、弹层。在亮/暗与多主题色下验证视觉契约。",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const DataCockpitPrototype: Story = {
  name: "数据驾驶舱原型",
  render: () => ({
    components: { DataCockpitPrototypeView },
    template: "<DataCockpitPrototypeView />",
  }),
};
