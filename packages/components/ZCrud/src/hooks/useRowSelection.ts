import type { ComputedRef, Ref } from 'vue'
import { computed, ref, toRaw, unref } from 'vue'
import type { TableInstance } from 'element-plus'
import type { TablePropsType } from '../types'

export function useRowSelection(propsRef: ComputedRef<TablePropsType>, tableRef: Ref<TableInstance>, emit: EmitType) {
  const selectedRowRef = ref<Recordable[]>([])

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef).options
    return rowKey
  })

  const handleSelectionChange = (rows: Recordable[]) => {
    selectedRowRef.value = toRaw(rows)
    emit('selectionChange', rows)
  }

  const clearSelection = () => {
    tableRef.value!.clearSelection()
  }

  const toggleRowSelection = (row: Recordable, selected?: boolean) => {
    tableRef.value.toggleRowSelection(row, selected)
  }

  const setSelectedRows = (rows?: Recordable[]) => {
    if (rows) {
      rows.forEach((row) => {
        tableRef.value!.toggleRowSelection(row, true)
      })
    } else {
      clearSelection()
    }
  }

  const delSelectedRows = (rows: Recordable[]) => {
    rows.forEach((row) => {
      tableRef.value!.toggleRowSelection(row, false)
    })
  }

  const getSelectRowKeys = computed(() => {
    return selectedRowRef.value.map(item => item[unref(getRowKey) as string])
  })

  const getSelectRows = computed(() => {
    return unref(selectedRowRef)
  })

  return {
    selectedRowRef,
    handleSelectionChange,
    clearSelection,
    toggleRowSelection,
    getSelectRows,
    getSelectRowKeys,
    setSelectedRows,
    delSelectedRows,
  }
}
