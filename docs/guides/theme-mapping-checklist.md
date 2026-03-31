# 主题变量映射清单（V2）

## 目标
- 明确哪些差异可通过变量表达。
- 明确哪些差异需要覆盖层兜底。

## 映射原则
1. 先改 `semantic-vars`。
2. 再改 `element-plus-mapping` / `workbench-mapping`。
3. 最后才进入 `workbench-overrides`。

## 首批组件清单
| 组件 | 变量可表达（优先） | 需覆盖兜底（限制使用） |
| --- | --- | --- |
| Button | 主色、文本色、边框色、圆角、hover 背景 | 分段拼接圆角（如 `shortcut-btn`） |
| Input / Select | 背景、边框、焦点 ring、文本色、圆角 | 拼接日期输入结构（如 `date-picker-joined`） |
| Table | 头部背景、行 hover、边框、文本色 | 固定列背景细节、业务行高细化 |
| Drawer / Dialog | 背景、阴影、padding 基线 | 业务定制内部间距与结构块 |
| Tabs / Radio | 激活色、hover 色、高度、圆角 | 业务分段按钮形态 |

## 验收要点
- 主题切换后，优先观察变量层是否已覆盖目标差异。
- 只有变量层确认不足时，才允许新增覆盖规则。
- 覆盖规则必须限制在业务作用域或组件 class 范围。
