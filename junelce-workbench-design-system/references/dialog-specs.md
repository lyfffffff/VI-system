# 弹窗/抽屉规范

> Workbench风格的弹窗（Dialog）和抽屉（Drawer）详细规范。

## 弹窗全局样式

### 圆角差异

弹窗/抽屉内的控件使用**更小的圆角**，区别于页面全局的10px，避免在小空间内显得过圆：

| 控件 | 页面全局 | 弹窗/抽屉内 |
|------|---------|-------------|
| 输入框 | 10px | 6px |
| 选择器 | 10px | 6px |
| 文本域 | 10px | 6px |
| 按钮 | 10px | `var(--el-border-radius-base)` |

### CSS覆盖

```css
/* 弹窗/抽屉内输入框圆角6px */
.el-dialog .el-input__wrapper,
.el-drawer .el-input__wrapper,
.el-dialog .el-select__wrapper,
.el-drawer .el-select__wrapper,
.el-dialog .el-textarea__inner,
.el-drawer .el-textarea__inner {
  border-radius: 6px !important;
}

/* 弹窗/抽屉内按钮圆角 */
.el-dialog .el-button,
.el-drawer .el-button {
  border-radius: var(--el-border-radius-base) !important;
}

/* footer按钮间距12px */
.el-dialog__footer .el-button + .el-button,
.el-drawer__footer .el-button + .el-button {
  margin-left: 0 !important; /* 由flex gap控制 */
}

/* 密码输入框有append按钮时，右侧圆角取消 */
.el-input-group .el-input__wrapper {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

/* el-checkbox-button主题色支持 */
.el-checkbox-button.is-checked .el-checkbox-button__inner {
  background-color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary) !important;
  box-shadow: -1px 0 0 0 var(--el-color-primary) !important;
}
```

## 弹窗结构

### 标准弹窗

```vue
<el-dialog
  v-model="visible"
  title="弹窗标题"
  width="500px"
  :close-on-click-modal="false"
>
  <el-form :model="form" label-position="top">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="字段1">
          <el-input v-model="form.field1" class="w-full" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="字段2">
          <el-select v-model="form.field2" class="w-full" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <template #footer>
    <div class="flex justify-end" style="gap: 12px;">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </template>
</el-dialog>
```

### 弹窗尺寸参考

| 类型 | 宽度 | 场景 |
|------|------|------|
| 小型 | 400px | 确认弹窗、简单表单 |
| 标准 | 500px | 常规表单 |
| 大型 | 800-900px | 复杂表单、多列 |
| 超大 | 1000px | 三栏弹窗（树+列表+已选） |

## 抽屉结构

### 标准抽屉

```vue
<el-drawer
  v-model="visible"
  title="抽屉标题"
  direction="rtl"
  size="480px"
>
  <el-scrollbar>
    <div style="padding: 0 20px;">
      <!-- 内容区 -->
    </div>
  </el-scrollbar>

  <template #footer>
    <div class="flex justify-end" style="gap: 12px;">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </template>
</el-drawer>
```

### 抽屉尺寸参考

| 宽度 | 场景 |
|------|------|
| 360px | 详情面板、简单配置 |
| 480px | 标准表单 |
| 640px | 复杂表单、主题设置 |

---

## 三列选择弹窗（授权/指标选择）

### 布局结构

```
┌──────────────────────────────────────────────────────────────┐
│  Tab栏 (53px, var(--el-fill-color-light) 背景)                │
├──────────┬────────────────────────────────┬───────────────────┤
│          │                                │                   │
│ 分类导航  │         内容列表               │    已选列表        │
│ (180px)  │        (flex: 1)               │   (280px)         │
│          │                                │                   │
├──────────┴────────────────────────────────┴───────────────────┤
│  Footer                               [取消]    [确定]        │
└──────────────────────────────────────────────────────────────┘
```

### 完整代码

```vue
<el-dialog width="1000px" :before-close="handleClose">
  <div class="flex h-[560px]"
       style="border: 1px solid var(--el-border-color-lighter); border-radius: 8px; overflow: hidden;">
    <!-- Left + Middle -->
    <div class="flex flex-col flex-1">
      <!-- Tab栏 (53px) -->
      <div class="flex items-center"
           style="height: 53px; background-color: var(--el-fill-color-light);
                  border-bottom: 1px solid var(--el-border-color-lighter);">
        <span v-for="tab in tabs" :key="tab.key"
              class="cursor-pointer text-sm h-full flex items-center px-4 transition-all"
              :style="activeTab === tab.key
                ? `color: var(--el-color-primary); font-weight: 500;`
                : 'color: var(--el-text-color-regular);'"
              @click="activeTab = tab.key">
          {{ tab.label }}
        </span>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <!-- 左侧分类导航 (180px) -->
        <div class="w-[180px] flex flex-col"
             style="background-color: var(--el-fill-color-light);
                    border-right: 1px solid var(--el-border-color-lighter);">
          <el-scrollbar>
            <el-menu :default-active="activeCategory" class="!border-r-0"
                     @select="scrollToCategory">
              <el-menu-item v-for="cat in categories" :key="cat.id" :index="cat.id"
                            class="!h-10 !leading-10">
                {{ cat.name }}
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </div>

        <!-- 中间内容区 -->
        <el-scrollbar class="flex-1">
          <div class="p-3">
            <div v-for="cat in categories" :key="cat.id" :id="`cat-${cat.id}`" class="mb-6">
              <!-- 分类标题 with Checkbox -->
              <div class="flex items-center gap-2 mb-3 px-2 py-2 rounded"
                   style="background-color: var(--el-fill-color-light);">
                <el-checkbox
                  :model-value="isCategoryAllSelected(cat)"
                  :indeterminate="isCategoryIndeterminate(cat)"
                  @change="(val) => toggleCategory(cat, !!val)">
                  <span class="font-medium"
                        style="color: var(--el-text-color-primary);">{{ cat.name }}</span>
                </el-checkbox>
              </div>
              <!-- Items Grid -->
              <div class="grid grid-cols-2 gap-2 px-2">
                <el-checkbox v-for="item in cat.children" :key="item.id"
                             :model-value="isItemSelected(item.id)"
                             @change="toggleItem(item.id)" class="!mr-0">
                  {{ item.name }}
                </el-checkbox>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 右侧已选面板 (280px) -->
    <div class="w-[280px] flex flex-col"
         style="border-left: 1px solid var(--el-border-color-lighter);">
      <div class="px-4 flex justify-between items-center"
           style="height: 53px; background-color: var(--el-fill-color-light);
                  border-bottom: 1px solid var(--el-border-color-lighter);">
        <span class="text-sm font-medium">
          已选 <span style="color: var(--el-color-primary);">({{ selectedItems.length }}项)</span>
        </span>
        <el-button link type="primary" size="small" @click="clearAll">清空</el-button>
      </div>
      <el-scrollbar class="flex-1">
        <div class="p-3">
          <div v-for="id in selectedItems" :key="id"
               class="flex items-center justify-between px-3 py-2 mb-2 rounded"
               style="background-color: var(--el-fill-color-light);
                      border: 1px solid var(--el-border-color-lighter);">
            <span class="text-sm truncate"
                  style="color: var(--el-text-color-regular);">{{ getItemName(id) }}</span>
            <el-icon class="cursor-pointer" style="color: var(--el-text-color-placeholder);"
                     @click="removeItem(id)"><Close /></el-icon>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>

  <template #footer>
    <div class="flex justify-end" style="gap: 12px;">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </template>
</el-dialog>
```

---

## 动态行配置弹窗

适用于"允许查看他人数据"等多行配置场景：

```vue
<!-- 标题行 -->
<div class="flex items-start gap-3 mb-3">
  <div class="grid grid-cols-4 gap-3 flex-1 text-sm font-medium"
       style="color: var(--el-text-color-primary);">
    <div>列1</div>
    <div>列2</div>
    <div>列3</div>
    <div>列4</div>
  </div>
  <div style="width: 56px;"></div>
</div>

<!-- 数据行 -->
<div v-for="(row, index) in dataRows" :key="row.id" class="flex items-start gap-3 mb-3">
  <div class="grid grid-cols-4 gap-3 flex-1">
    <el-select v-model="row.field1" multiple filterable clearable class="w-full hide-suffix">
      <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
    <!-- 其他字段... -->
  </div>

  <div class="flex items-center pt-1" style="width: 56px; gap: 8px;">
    <template v-if="dataRows.length > 1">
      <el-button :icon="Minus" circle size="small" type="danger" plain @click="removeRow(row.id)" />
    </template>
    <el-button v-if="index === dataRows.length - 1"
               :icon="Plus" circle size="small" type="primary" plain @click="addRow" />
  </div>
</div>
```

---

## 确认弹窗

使用`ElMessageBox`而非自定义弹窗：

```typescript
import { ElMessageBox, ElMessage } from 'element-plus'

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该记录吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}
```
