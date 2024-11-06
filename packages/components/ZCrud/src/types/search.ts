import type { Ref } from 'vue'
import type { SearchColumnComponentType } from './component'

type SelectColumnOptions =
  | string
  | Fn<any, LabelValueOptions>
  | PromiseFn<any, LabelValueOptions>
  | LabelValueOptions
  | Ref<LabelValueOptions>

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
  options?: SelectColumnOptions
  labelWidth?: number
  rules?: any
  error?: string
  size?: 'large' | 'default' | 'small'
  for?: string
}
