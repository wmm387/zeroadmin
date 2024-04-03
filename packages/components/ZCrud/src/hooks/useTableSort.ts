import type { ComputedRef } from 'vue'
import type { Column } from '../types'

// 格式化ElTable排序值
const formatElTableSortValue = (sort: string): string | null => {
  if (sort === 'ascending') {
    return 'asc'
  } else if (sort === 'descending') {
    return 'desc'
  } else {
    return null
  }
}

export function useTableSort(getSortColumns: ComputedRef<Column[]>, refresh: Fn, emit: EmitType) {
  // 设置列的排序改为我们自定义的排序
  const handleHeaderClass = ({ column }) => {
    column.order = column.multiOrder
    return ''
  }

  // 列表排序
  const sortChange = ({ column, order }) => {
    // 将点击的排序赋给我们自定义排序字段multiOrder
    column.multiOrder = order
    // 格式化排序字段值
    const formatOrder = formatElTableSortValue(column.multiOrder)
    // 获取要排序的表格列,取出排序值并刷新数据
    const sortColumn = getSortColumns.value.find(i => i.prop === column.property)
    if (sortColumn) {
      const sortProp = sortColumn?.sortableProp ?? sortColumn.prop
      refresh({ [sortProp]: formatOrder })
    }
    emit('sortChange', {
      prop: column.property,
      order: formatOrder,
    })
  }

  return { handleHeaderClass, sortChange }
}
