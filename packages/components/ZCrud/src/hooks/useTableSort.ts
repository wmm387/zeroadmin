import type { Ref } from 'vue'
import type { Column, SortColumn } from '../types'
import { isBoolean, isDef } from '@pkg/utils'
import { cloneDeep } from 'lodash-es'
import { computed, unref } from 'vue'

export function useSortColumns(columnsRef: Ref<Column[]>) {
  const sortColumns = computed<SortColumn[]>(() => {
    const columns = cloneDeep(unref(columnsRef))
    return columns?.filter(i => i.sort)?.map(col => {
      const sort = isBoolean(col.sort) ? {} : col.sort
      return {
        ...col,
        sort: {
          label: sort?.label || col.label,
          prop: sort?.prop || col.prop,
          order: isDef(sort?.order) ? sort?.order : (sort?.default || ''),
          default: sort?.default || null,
        },
      }
    })
  })

  return sortColumns
}

export function useSortChange(columnsRef: Ref<Column[]>, refresh: Fn, emit: EmitType) {
  const sortChange = ({ prop, sort }) => {
    columnsRef.value.forEach(col => {
      if (col.prop === prop) {
        col.sort = sort
        refresh()
        emit('sortChange', { prop, order: sort.order })
      }
    })
  }

  return sortChange
}
