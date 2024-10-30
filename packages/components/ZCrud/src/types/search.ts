import type { Ref } from 'vue'
import type { SearchColumnComponentType } from './component'

export interface ColumnDict {
  // 内置字典名称
  name?: string
  // 自定义api接口
  api?: PromiseFn
  // 直接设置字典值
  data?: any
  // ref值
  refData?: Ref<any>
  // 表格列的值是否翻译为字典对应标签
  translation?: boolean
  // 表格key 和 value的props设置
  props?: {
    label?: string
    value?: string
  }
  tagColors?: Record<string, unknown>
}

export interface SearchColumn {
  prop: string
  label?: string
  default?: any
  slot?: string
  render?: (form?: any, item?: SearchColumn, row?: any, column?: any, index?: number) => any
  show?: boolean | ((column?: SearchColumn) => boolean)
  placeholder?: string
  component?: SearchColumnComponentType
  componentAttr?: any
  fuzzyAttr?: { field?: string, defaultValue?: number }
  dateRangeField?: { prefix?: string, start_at?: string, end_at?: string }
  dict?: ColumnDict // 字典数据
  labelWidth?: number
  rules?: any
  error?: string
  size?: 'large' | 'default' | 'small'
  for?: string
}
