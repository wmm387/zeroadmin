import type { WatchStopHandle } from 'vue'
import type { Column, Options, TableActionType, TablePropsType } from '../types'
import { isProdMode } from '@pkg/utils'
import { defaultsDeep } from 'lodash-es'
import { onUnmounted, ref, unref, watch } from 'vue'

export function useZCrud(props: TablePropsType, defaultOptions?: Partial<Options>): [
  (instance: TableActionType) => void,
  Partial<TableActionType>,
] {
  const tableRef = ref<Nullable<TableActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)
  // const formRef = ref<Nullable<UseTableMethod>>(null)

  const defaultProps = defaultOptions ? { options: defaultOptions } : {}

  let stopWatch: WatchStopHandle

  const register = (instance: TableActionType) => {
    isProdMode() && onUnmounted(() => {
      tableRef.value = null
      loadedRef.value = null
    })

    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef)) return

    tableRef.value = instance
    // formRef.value = formInstance
    props && instance.setProps(defaultsDeep({}, unref(props), defaultProps))
    loadedRef.value = true

    stopWatch?.()

    stopWatch = watch(
      () => props,
      () => {
        props && instance.setProps(defaultsDeep({}, unref(props), defaultProps))
      },
      {
        immediate: true,
        deep: true,
      },
    )
  }

  function getTableInstance(): TableActionType {
    const table = unref(tableRef)
    if (!table) {
      throw new Error('The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!')
    }
    return table as TableActionType
  }

  const methods: Partial<TableActionType> = {
    refresh: async (opt?: any) => {
      return await getTableInstance().refresh(opt)
    },
    setProps: (props: Partial<TablePropsType>) => {
      getTableInstance().setProps(props)
    },
    setLoading: (loading: boolean) => {
      getTableInstance().setLoading(loading)
    },
    setColumns: (columns: Column[]) => {
      getTableInstance().setColumns(columns)
    },
    getSelectRows: () => {
      return getTableInstance().getSelectRows()
    },
    getSelectRowKeys: () => {
      return getTableInstance().getSelectRowKeys()
    },
    setSelectedRows: (rows: Recordable[]) => {
      getTableInstance().setSelectedRows(rows)
    },
    delSelectedRows: (rows: Recordable[]) => {
      getTableInstance().delSelectedRows(rows)
    },
    clearSelection: () => {
      getTableInstance().clearSelection()
    },
    toggleRowSelection: (row: Recordable, selected?: boolean) => {
      getTableInstance().toggleRowSelection(row, selected)
    },
    getFieldsValue: () => {
      return getTableInstance().getFieldsValue()
    },
    setFieldsValue: (values: Recordable) => {
      return getTableInstance().setFieldsValue(values)
    },
    removeFieldsValue: (fields: string | string[]) => {
      return getTableInstance().removeFieldsValue(fields)
    },
    resetFields: () => {
      getTableInstance().resetFields()
    },
    getTableData: () => {
      return getTableInstance().getTableData()
    },
    // redoHeight: () => {
    //   getTableInstance().redoHeight()
    // },
    // getRawDataSource: () => {
    //   return getTableInstance().getRawDataSource()
    // },
    // getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
    //   const columns = getTableInstance().getColumns({ ignoreIndex }) || []
    //   return toRaw(columns)
    // },
    // setTableData: (values: any[]) => {
    //   return getTableInstance().setTableData(values)
    // },
    // setPagination: (info: Partial<PaginationProps>) => {
    //   return getTableInstance().setPagination(info)
    // },

    // getPaginationRef: () => {
    //   return getTableInstance().getPaginationRef()
    // },
    // getSize: () => {
    //   return toRaw(getTableInstance().getSize())
    // },
    // updateTableData: (index: number, key: string, value: any) => {
    //   return getTableInstance().updateTableData(index, key, value)
    // },
    // deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => {
    //   return getTableInstance().deleteTableDataRecord(rowKey)
    // },
    // insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => {
    //   return getTableInstance().insertTableDataRecord(record, index)
    // },
    // updateTableDataRecord: (rowKey: string | number, record: Recordable) => {
    //   return getTableInstance().updateTableDataRecord(rowKey, record)
    // },
    // findTableDataRecord: (rowKey: string | number) => {
    //   return getTableInstance().findTableDataRecord(rowKey)
    // },
    // getCacheColumns: () => {
    //   return toRaw(getTableInstance().getCacheColumns())
    // },
    // getForm: () => {
    //   return unref(formRef) as unknown as FormActionType
    // },
    // setShowPagination: async (show: boolean) => {
    //   getTableInstance().setShowPagination(show)
    // },
    // getShowPagination: () => {
    //   return toRaw(getTableInstance().getShowPagination())
    // },
    // expandAll: () => {
    //   getTableInstance().expandAll()
    // },
    // expandRows: (keys: string[]) => {
    //   getTableInstance().expandRows(keys)
    // },
    // collapseAll: () => {
    //   getTableInstance().collapseAll()
    // },
    // scrollTo: (pos: string) => {
    //   getTableInstance().scrollTo(pos)
    // },
  }

  return [register, methods]
}
