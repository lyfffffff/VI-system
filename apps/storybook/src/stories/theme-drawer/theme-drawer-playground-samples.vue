<!-- Playground 内联 / 弹窗共用的基础控件条，便于主题回归对比。 -->
<script setup lang="ts">
interface ITableRow {
  date: string;
  name: string;
  address: string;
}

interface ICascaderOption {
  value: string;
  label: string;
  children?: ICascaderOption[];
}

interface ITreeOption {
  value: string;
  label: string;
  children?: ITreeOption[];
}

defineProps<{
  /** inline：页头工具条；dialog：弹窗内纵向排列 */
  layout: "inline" | "dialog";
  /** 父组件 reactive，与子块共享同一份状态 */
  form: {
    selectValue: string;
    selectMultipleValue: string[];
    inputValue: string;
    textareaValue: string;
    inputNumberValue: number;
    dateValue: string;
    dateRangeValue: string[];
    timeValue: string;
    timeRangeValue: string[];
    cascaderValue: string[];
    checkboxValue1: boolean;
    checkboxValue2: boolean;
    checkboxGroupValue: string[];
    radioValue: string;
    radioButtonValue: string;
    switchValue1: boolean;
    switchValue2: boolean;
    sliderValue: number;
    rateValue: number;
    colorValue: string;
    treeSelectValue: string[];
    tableData: ITableRow[];
    paginationCurrentPage: number;
    paginationPageSize: number;
  };
}>();

const OPTION_ITEMS = [
  { value: "1", label: "选项1" },
  { value: "2", label: "选项2" },
  { value: "3", label: "选项3" },
] as const;

const RADIO_ITEMS = [
  { value: "a", label: "方案 A" },
  { value: "b", label: "方案 B" },
] as const;

const CHECKBOX_ITEMS = [
  { value: "Option 1", label: "Option 1" },
  { value: "Option 2", label: "Option 2" },
  { value: "Option 3", label: "Option 3" },
] as const;

const CASCADER_OPTIONS: ICascaderOption[] = [
  {
    value: "region-1",
    label: "华东",
    children: [
      { value: "shanghai", label: "上海" },
      { value: "hangzhou", label: "杭州" },
    ],
  },
  {
    value: "region-2",
    label: "华南",
    children: [
      { value: "guangzhou", label: "广州" },
      { value: "shenzhen", label: "深圳" },
    ],
  },
];

const TREE_OPTIONS: ITreeOption[] = [
  {
    value: "workspace",
    label: "工作台",
    children: [
      { value: "cockpit", label: "数据驾驶舱" },
      { value: "report", label: "经营报表" },
    ],
  },
  {
    value: "system",
    label: "系统设置",
    children: [
      { value: "account", label: "账号管理" },
      { value: "permission", label: "权限管理" },
    ],
  },
];
</script>

<template>
  <div
    class="tdp-samples"
    :class="layout === 'inline' ? 'tdp-samples--inline' : 'tdp-samples--dialog'"
  >
    <template v-if="layout === 'inline'">
      <el-button type="primary" class="sb-no-flex-stretch">查询</el-button>
      <el-button type="default" class="sb-no-flex-stretch">重置</el-button>
      <el-select
        v-model="form.selectValue"
        placeholder="请选择"
        class="tdp-samples__select"
      >
        <el-option
          v-for="item in OPTION_ITEMS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="form.inputValue"
        placeholder="请输入关键字"
        class="tdp-samples__input"
      />
      <el-date-picker
        v-model="form.dateValue"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="请选择日期"
        class="tdp-samples__date"
      />
    </template>

    <el-form
      v-else
      label-position="top"
      class="tdp-samples__form"
      @submit.prevent
    >
      <el-form-item label="按钮">
        <div class="tdp-samples__row">
          <el-button type="primary">主题按钮</el-button>
          <el-button type="primary" size="small">小按钮</el-button>
          <el-button type="primary" plain>朴素按钮</el-button>
        </div>
      </el-form-item>

      <el-form-item label="输入与选择">
        <div class="tdp-samples__grid tdp-samples__grid--2">
          <el-input v-model="form.inputValue" placeholder="请输入" clearable />
          <el-input-number v-model="form.inputNumberValue" :min="0" :max="999" />
          <el-input
            v-model="form.textareaValue"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
          <el-select v-model="form.selectValue" placeholder="单选">
            <el-option
              v-for="item in OPTION_ITEMS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="form.selectMultipleValue"
            placeholder="多选"
            multiple
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option
              v-for="item in OPTION_ITEMS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-cascader
            v-model="form.cascaderValue"
            :options="CASCADER_OPTIONS"
            placeholder="级联选择"
          />
          <el-tree-select
            v-model="form.treeSelectValue"
            :data="TREE_OPTIONS"
            multiple
            filterable
            show-checkbox
            check-strictly
            collapse-tags
            collapse-tags-tooltip
            placeholder="树选择"
          />
        </div>
      </el-form-item>

      <el-form-item label="日期与时间">
        <div class="tdp-samples__grid tdp-samples__grid--2">
          <el-date-picker
            v-model="form.dateValue"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
          />
          <el-date-picker
            v-model="form.dateRangeValue"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-time-picker
            v-model="form.timeValue"
            value-format="HH:mm:ss"
            placeholder="选择时间"
          />
          <el-time-picker
            v-model="form.timeRangeValue"
            is-range
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </div>
      </el-form-item>

      <el-form-item label="选择器组件">
        <div class="tdp-samples__row">
          <el-checkbox v-model="form.checkboxValue1" label="Option 1" />
          <el-checkbox v-model="form.checkboxValue2" label="Option 2" />

          <el-checkbox-group v-model="form.checkboxGroupValue">
            <el-checkbox
              v-for="item in CHECKBOX_ITEMS"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>

          <el-radio-group v-model="form.radioValue">
            <el-radio v-for="r in RADIO_ITEMS" :key="r.value" :label="r.value">
              {{ r.label }}
            </el-radio>
          </el-radio-group>

          <el-radio-group v-model="form.radioButtonValue">
            <el-radio-button
              v-for="r in RADIO_ITEMS"
              :key="`btn-${r.value}`"
              :label="r.value"
            >
              {{ r.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item label="开关与数值组件">
        <div class="tdp-samples__grid tdp-samples__grid--2">
          <el-switch
            v-model="form.switchValue1"
            active-text="Pay by month"
            inactive-text="Pay by year"
          />
          <el-switch
            v-model="form.switchValue2"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
          <el-slider v-model="form.sliderValue" :max="100" show-input />
          <el-rate v-model="form.rateValue" />
          <el-color-picker v-model="form.colorValue" />
          <el-progress :percentage="form.sliderValue" />
        </div>
      </el-form-item>

      <el-form-item label="表格与分页">
        <el-table :data="form.tableData" class="tdp-samples__table">
          <el-table-column prop="date" label="Date" width="160" />
          <el-table-column prop="name" label="Name" width="120" />
          <el-table-column prop="address" label="Address" min-width="220" />
        </el-table>

        <div class="tdp-samples__pagination">
          <el-pagination
            v-model:current-page="form.paginationCurrentPage"
            v-model:page-size="form.paginationPageSize"
            layout="total, prev, pager, next, jumper"
            :total="form.tableData.length * 10"
            :page-sizes="[10, 20, 50]"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="less">
.tdp-samples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;

  &--dialog {
    display: block;
  }

  &__select {
    width: 130px;
  }

  &__select-multiple {
    width: 200px;
  }

  &__input {
    width: 160px;
  }

  &__date {
    width: 260px;
  }

  &__radio {
    flex-wrap: wrap;
    gap: 4px 12px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  &__grid {
    display: grid;
    gap: 10px;
    width: 100%;

    &--2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &__table {
    margin-top: 10px;
    width: 100%;
  }

  &__pagination {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
