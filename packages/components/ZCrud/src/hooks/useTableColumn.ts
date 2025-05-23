import type { ComputedRef, Ref } from 'vue'
import type { Column, PaginationProps, TablePropsType } from '../types'
import { isDef, isFunction, isObject, isUnDef, storageLocal } from '@pkg/utils'
import { cloneDeep, sortBy } from 'lodash-es'
import { computed, ref, unref, watch } from 'vue'
import { defaultOperationColumn } from '../defaultData'

export function useTableColumn(
  propsRef: ComputedRef<TablePropsType>,
  getColumnActions?: ComputedRef<any[]>,
  getPagination?: ComputedRef<PaginationProps>,
) {
  const columnsRef = ref(unref(propsRef).columns) as Ref<Column[]>
  const defaultColumnsRef = ref(unref(propsRef).columns) as Ref<Column[]>

  const storageKey = computed(() => {
    const { options } = unref(propsRef)
    return `z-crud-table-columns:${options.key}`
  })

  const handleIndexColumn = (column: Column) => {
    if (isDef(column.index) || isDef(column.render)) return
    column.index = (index) => {
      const paginationInfo = unref(getPagination)
      if (!paginationInfo) return index + 1
      return ((paginationInfo.page || 1) - 1) * paginationInfo.pageSize + index + 1
    }
  }

  // 可编辑列提交方法
  const editColumnSubmitFn = () => {
    const { editColumnSubmit } = unref(propsRef.value.options)
    if (isDef(editColumnSubmit?.fn) && isFunction(editColumnSubmit.fn)) {
      return async (row: Recordable, column: Column, value: any) => {
        return await editColumnSubmit.fn(row, column, value)
      }
    }
    if (isDef(editColumnSubmit?.api) && isFunction(editColumnSubmit.api)) {
      return async (row: Recordable, column: Column, value: any) => {
        if (!row.id) return
        return await editColumnSubmit.api({
          id: row.id,
          [column.prop]: value,
        })
      }
    }
    return null
  }

  // 处理可编辑列
  const handleEditColumn = (column: Column) => {
    if (isUnDef(column.edit?.show)) {
      column.edit.show = true
    }
    if (isUnDef(column.edit?.updateFn)) {
      column.edit.updateFn = editColumnSubmitFn()
    }
    if (isUnDef(column.edit?.doRefresh)) {
      const { editColumnSubmit } = unref(propsRef.value.options)
      column.edit.doRefresh = editColumnSubmit?.doRefresh ?? 'error'
    }
  }

  const getColumns = computed(() => {
    const columns = cloneDeep(unref(columnsRef))
    if (!columns) {
      return []
    }

    // 获取本地存储的数据
    const _storageData: Column[] = storageLocal.getItem(storageKey.value)
    const storageData = {}
    if (_storageData) {
      _storageData.forEach((item, index) => {
        const temp = { _sort: index } as any
        isDef(item.width) && (temp.width = item.width)
        isDef(item.minWidth) && (temp.minWidth = item.minWidth)
        isDef(item.show) && (temp.show = item.show)
        isDef(item.fixed) && (temp.fixed = item.fixed)
        storageData[item.prop] = temp
      })
    }

    const { align = 'left', columnWidth, showOverflowTooltip = true } = unref(propsRef.value.options)
    columns.forEach((item, index) => {
      item.prop = item.prop ?? item.slot ?? item.label
      item._sort = index
      item.showDisabled = isFunction(item.show) ? true : item.showDisabled
      item.show = isDef(item.show) ? isFunction(item.show) ? item.show() : item.show : true
      item.fixed = item.fixed ?? false
      item.align ?? (item.align = align)
      item.showOverflowTooltip ?? (item.showOverflowTooltip = showOverflowTooltip)
      item.width ?? (item.width = null)
      item.minWidth ?? (item.minWidth = null)
      !item.minWidth && !item.width && (item.width = columnWidth)
      if (storageData?.[item.prop]) {
        Object.assign(item, { ...storageData[item.prop] })
      }
      if (item.type === 'index') {
        handleIndexColumn(item)
      }
      if (item?.edit) {
        handleEditColumn(item)
      }
    })
    return sortBy(columns, '_sort')
  })

  const getActionColumn = computed(() => {
    const { operationColumn } = unref(propsRef.value.options)
    if (operationColumn) {
      if (isObject(operationColumn)) {
        return Object.assign(defaultOperationColumn(), { ...operationColumn })
      }
      return defaultOperationColumn()
    } else {
      if (getColumnActions.value.length) {
        return defaultOperationColumn()
      }
      return false
    }
  })

  const setColumns = (columnList: Column[]) => {
    const columns = cloneDeep(columnList)
    storageLocal.setItem(storageKey.value, columns)
    columnsRef.value = columns
  }

  const toDefaultColumns = () => {
    storageLocal.removeItem(storageKey.value)
    const columns = cloneDeep(unref(defaultColumnsRef))
    columnsRef.value = columns
  }

  watch(
    () => unref(propsRef).columns,
    (columns) => {
      columnsRef.value = columns
      defaultColumnsRef.value = columns
    },
  )

  return { columnsRef, getColumns, getActionColumn, setColumns, toDefaultColumns }
}
