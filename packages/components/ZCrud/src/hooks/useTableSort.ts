import type { Ref } from 'vue'
import type { Column, SortColumn } from '../types'
import { isBoolean, isDef, isPayload } from '@pkg/utils'
import { cloneDeep } from 'lodash-es'
import { computed, unref } from 'vue'

export function useTableSort(columnsRef: Ref<Column[]>, setFieldsValue: Fn, removeFieldsValue: Fn, refresh: Fn, emit: EmitType) {
  const sortColumns = computed<SortColumn[]>(() => {
    const columns = cloneDeep(unref(columnsRef))
    return columns?.filter(i => i.sort)?.map(col => {
      const sort = isBoolean(col.sort) ? {} : col.sort
      const column = {
        ...col,
        sort: {
          label: sort?.label || col.label,
          prop: sort?.prop || col.prop,
          order: isDef(sort?.order) ? sort?.order : (sort?.default || ''),
          default: sort?.default || null,
        },
      }
      if (isPayload(column.sort.order)) {
        setFieldsValue({ [column.sort.prop]: column.sort.order })
      } else {
        removeFieldsValue(column.sort.prop)
      }
      return column
    })
  })

  // 列表排序
  const sortChange = ({ prop, sort }) => {
    columnsRef.value.forEach(col => {
      if (col.prop === prop) {
        col.sort = sort
        if (isPayload(sort.order)) {
          setFieldsValue({ [sort.prop]: sort.order })
        } else {
          removeFieldsValue(sort.prop)
        }
        refresh()
        emit('sortChange', { prop, order: sort.order })
      }
    })
  }

  return { sortColumns, sortChange }
}
