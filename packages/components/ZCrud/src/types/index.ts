import type { Column, EditColumnType, SortColumn } from './column'
import type { SearchColumn } from './search'

export { Column, EditColumnType, SearchColumn, SortColumn }

export interface FetchSetting {
  // 请求当前页数字段
  pageField: string
  // 请求每页显示多少条字段
  sizeField: string
  // 请求结果列表字段  支持 a.b.c
  listField: string
  // 请求结果总数字段  支持 a.b.c
  totalField: string
  // 不分页时结果列表字段 支持 a.b.c
  noPaginationListField: string
}

export interface SlotType {
  form?: any // 搜索插槽
  item?: SearchColumn // 搜索插槽
  row?: any // 表格列插槽
  column?: Column // 表格列插槽
  index?: number // 表格列插槽
}

export interface ActionBtnPopconfirm {
  title: string
  okText?: string
  cancelText?: string
  cancel?: Fn
  icon?: string
  width?: number
}

export interface ActionBtn {
  // api
  api?: PromiseFn
  // 方法
  handle?: Fn | PromiseFn
  // 按钮文案
  text?: string
  // 显示权限
  auth?: string[]
  // 是否异步方法
  isAsync?: boolean
  // 请求后是否刷新,'after'(请求后刷新,isAsync为true时默认值),'error'(只在请求失败时刷新),false(不刷新,isAsync为false时默认值)
  doRefresh?: 'after' | 'error' | false
  // 请求是否展示loading,isAsync为true时默认展示,反则默认不展示
  showLoading?: boolean
  // 按钮是否暂时loading
  showBtnLoading?: boolean
  // 是否为禁用状态
  disabled?: boolean | Fn<any, boolean>
  // 尺寸
  size?: 'large' | 'default' | 'small'
  // 是否显示
  show?: boolean | Fn<any, boolean>
  //  颜色
  color?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | ''
  // 位置, 表格头部按钮/表格列按钮
  position?: 'table-header' | 'table-column'
  // 类型
  btnType?: 'plain' | 'round' | 'circle' | 'link' | 'text'
  // 特殊按钮,新增/编辑/删除
  special?: 'add' | 'create' | 'edit' | 'update' | 'delete'
  // 弹出框配置
  popconfirm?: ActionBtnPopconfirm | boolean
}

export interface Options {
  // 区分每个表格,必须唯一
  key: string
  rowKey?: string | ((row) => any)
  stripe?: boolean
  align?: 'left' | 'center' | 'right'
  border?: boolean
  size?: 'large' | 'default' | 'small'
  fit?: boolean
  pageFixed?: boolean
  showOverflowTooltip?: boolean
  showHeader?: boolean
  columnWidth?: number
  highlightCurrentRow?: boolean
  defaultExpandAll?: boolean
  expandRowKeys?: any[]
  tooltipOptions?: any
  showSummary?: boolean
  sumText?: string
  summaryMethod?: ({ columns, data }) => any[]
  // 索引列
  indexColumn?: boolean | { width?: number, label?: string }
  // 操作列
  operationColumn?: boolean | { width?: number, label?: string, fixed?: boolean }
  // 搜索按钮是否行内展示
  searchBtnInline?: boolean
  // 搜索列默认配置项
  searchColumnDefaultOptions?: Partial<SearchColumn>
  // loading加载
  loading?: boolean
  // 接口请求对象
  api?: PromiseFn
  // 请求之前处理参数
  beforeFetch?: (params: Recordable) => Recordable | Promise<Recordable>
  // 自定义处理接口返回参数
  afterFetch?: (tableData: Recordable[]) => Recordable[] | Promise<Recordable[]>
  // 自带搜索参数
  fetchParams?: Recordable
  // 请求接口配置
  fetchSetting?: Partial<FetchSetting>
  // 立即请求接口
  immediate?: boolean
  // 是否展示分页
  pagination?: boolean
  // 每页显示多少条
  pageSize?: 10 | 20 | 30 | 50 | 100
  // 方法数组
  actions?: ActionBtn[]
  // 可编辑表格列提交方法
  editColumnSubmit?: {
    api?: PromiseFn
    fn?: (row: Recordable, column: Column, value: any) => any | Promise<any>
  }
  // 鉴权方法
  hasAuth?: Fn<string[], boolean>
}

export interface TablePropsType {
  options: Options
  searchColumns?: SearchColumn[]
  columns: Column[]
}

export interface TableActionType {
  refresh: Fn
  setProps: (props: Partial<TablePropsType>) => void
  setLoading: (loading: boolean) => void
  setColumns: (columns: Column[] | string[]) => void
  getSelectRows: () => Recordable[]
  getSelectRowKeys: () => any[]
  setSelectedRows: (rows: Recordable[]) => void
  delSelectedRows: (rows: Recordable[]) => void
  clearSelection: () => void
  toggleRowSelection: (row: Recordable, selected?: boolean) => void
  getFieldsValue: () => Recordable
  setFieldsValue: (values: Recordable) => Promise<void>
  removeFieldsValue: (fields: string | string[]) => void
  resetFields: () => void
  getTableData: () => Recordable[]
  expandAll: () => void
  expandRows: (keys: string[] | number[]) => void
  collapseAll: () => void
  scrollTo: (pos: string) => void // pos: id | "top" | "bottom"
  // setPagination: (info: Partial<PaginationProps>) => void
  setTableData: <T = Recordable>(values: T[]) => void
  updateTableDataRecord: (rowKey: string | number, record: Recordable) => Recordable | void
  deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => void
  insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => Recordable[] | void
  findTableDataRecord: (rowKey: string | number) => Recordable | void
  // getColumns: (opt?: GetColumnsParams) => Column[]
  getDataSource: <T = Recordable>() => T[]
  getRawDataSource: <T = Recordable>() => T
  redoHeight: () => void
  // getPaginationRef: () => PaginationProps | boolean
  // getSize: () => SizeType
  // getCacheColumns: () => BasicColumn[]
  emit?: EmitType
  updateTableData: (index: number, key: string, value: any) => Recordable
  setShowPagination: (show: boolean) => Promise<void>
  getShowPagination: () => boolean
  // setCacheColumnsByField?: (dataIndex: string | undefined, value: BasicColumn) => void
}

export interface PaginationProps {
  page: number
  pageSize: number
  total: number
}

// 搜索应用类型
export interface SearchRefType {
  // 搜索表单数据
  searchForm: Recordable
  setFieldsValue: (values: Recordable) => Promise<void>
  removeFieldsValue: (fields: string | string[]) => void
  resetFields: () => void
  getFieldsValue: () => Recordable
}
