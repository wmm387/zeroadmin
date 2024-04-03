import type { Options } from './types'

export const defaultFuzzyInputAttr = { field: 'match', defaultValue: 1 }

export const defaultDateRangeField = { prefix: '', start_at: 'start_at', end_at: 'end_at' }

export const defaultFetchSetting = () => ({
  pageField: 'page',
  sizeField: 'pageSize',
  listField: 'data.list',
  totalField: 'data.total',
  noPaginationListField: 'data',
})

export const defaultOperationColumn = () => ({
  width: 150,
  label: '操作',
  fixed: true,
})

export const defaultOptions: () => Partial<Options> = () => ({
  rowKey: 'id',
  fit: true,
  showHeader: true,
  tooltipOptions: {
    enterable: true,
    placement: 'top',
    showArrow: true,
    hideAfter: 200,
    popperClass: 'z-crud-table-tooltip-popper',
    popperOptions: { strategy: 'fixed' },
  },
  immediate: true,
  searchBtnInline: true,
})
