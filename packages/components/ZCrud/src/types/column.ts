import type { FormItemRule } from 'element-plus'
import type { TableColumnComponentType, TableColumnEditComponentType } from './component'

export interface EditColumnType {
  show?: boolean | ((row?: Recordable) => boolean)
  always?: boolean
  disabled?: boolean | Fn<any, boolean>
  required?: boolean
  rules?: FormItemRule | FormItemRule[]
  component: TableColumnEditComponentType
  componentAttr?: any
  updateFn?: (row: Recordable, column: Column, value: any) => any | Promise<any>
  // 更新后是否刷新,'after'(请求后刷新),'error'(请求失败时刷新,默认值),false(不刷新)
  doRefresh?: 'after' | 'error' | false
}

interface PropColumn {
  prop: string
  type?: 'selection' | 'index' | 'expand'
  slot?: string
  render?: (row?, column?, $index?) => any
}

interface TypeColumn {
  type: 'selection' | 'index' | 'expand'
  prop?: string
  slot?: string
  render?: (row?, column?, $index?) => any
}

interface SlotColumn {
  slot: string
  prop?: string
  type?: 'selection' | 'index' | 'expand'
  render?: (row?, column?, $index?) => any
}

interface RenderColumn {
  render: (row?, column?, $index?) => any
  slot?: string
  prop?: string
  type?: 'selection' | 'index' | 'expand'
}

export interface SortColumnOptions {
  prop?: string
  label?: string
  order?: null | string
  default?: 'asc' | 'desc' | null
}

interface BaseColumn {
  label?: string
  prop?: string
  show?: boolean | Fn<any, boolean>
  showDisabled?: boolean
  slot?: string
  component?: TableColumnComponentType
  componentAttr?: any
  render?: (row?, column?, $index?) => any
  children?: any[]
  type?: 'selection' | 'index' | 'expand'
  index?: number | ((index) => any)
  width?: string | number
  minWidth?: string | number
  columnKey?: string
  fixed?: 'left' | 'right' | false
  resizable?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  click?: (row?, index?) => any
  // 是否排序
  sortable?: boolean | 'custom'
  sort?: boolean | SortColumnOptions
  formatter?: (row?, column?, cellValue?, index?) => any
  selectable?: (row?, index?) => boolean
  // 数据刷新后是否保留选项，仅对  type=selection 的列有效， 请注意， 需指定 row-key 来让这个功能生效。
  reserveSelection?: boolean
  header?: {
    slot?: string
    render?: any
    align?: 'left' | 'center' | 'right'
    tooltip?: string
    showOverflowTooltip?: boolean
    formatter?: (row?, column?, cellValue?, index?) => string
  }
  // 拖拽排序
  _sort?: number
  edit?: EditColumnType
  className?: string
}

export interface SortColumn extends BaseColumn {
  sort?: SortColumnOptions
}

type TColumn = PropColumn | TypeColumn | SlotColumn | RenderColumn

export type Column = TColumn & BaseColumn
