---
group:
  title: 数据录入
  order: 2
toc: content
---

# QueryForm - 查询表单

基于 BizForm 扩展布局的查询表单。

## 代码演示

### 查询表单

<code src='../../src/biz-form/demos/query-form-1.tsx'></code>

### 查询表单-展开收起

<code src='../../src/biz-form/demos/query-form-2.tsx'></code>

### 查询表单-垂直布局

<code src='../../src/biz-form/demos/query-form-3.tsx'></code>

## API

### QueryForm

```typescript
import { QueryForm } from 'antd-more';
```

除了以下参数，其余和 [BizForm](/components/biz-form) 一样。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| submitText | 提交按钮文本 | `ReactNode` | `查询` |
| resetText | 重置按钮文本 | `ReactNode` | `重置` |
| defaultCollapsed | 默认状态下是否折叠超出的表单项 | `boolean` | `true` |
| defaultColsNumber | 默认显示的表单控件数量，数量大于等于控件数量则隐藏展开按钮。 | `number` | - |

#### 支持响应式

QueryForm 下的 Col 默认设置 `{ xs: 24, md: 12, lg: 8, xxl: 6 }` ，可以通过 BizFormItem 的 `colProps` 重置。
