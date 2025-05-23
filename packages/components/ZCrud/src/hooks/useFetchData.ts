import type { ComputedRef } from 'vue'
import type { PaginationProps, SortColumn, TablePropsType } from '../types'
import { isFunction, isPayload } from '@pkg/utils'
import { get } from 'lodash-es'
import { computed, reactive, ref, unref } from 'vue'
import { defaultFetchSetting } from '../defaultData'

export function useFetchData(
  propsRef: ComputedRef<TablePropsType>,
  sortColumns: ComputedRef<SortColumn[]>,
  setLoading: (boolean) => void,
  getPagination: ComputedRef<PaginationProps>,
  setPagination: (info: Partial<PaginationProps>) => void,
  getFieldsValue: () => Recordable,
  emit: EmitType,
) {
  const fetchSetting = computed(() => {
    return Object.assign(defaultFetchSetting(), propsRef.value.options.fetchSetting)
  })

  let fetchParams = reactive({})

  const tableData = ref([])
  const total = ref()

  const initFetchParams = () => {
    const searchForm = getFieldsValue()
    if (isPayload(searchForm)) {
      fetchParams = searchForm
    }
    sortColumns.value?.forEach(col => {
      if (isPayload(col.sort.order)) {
        fetchParams[col.sort.prop] = col.sort.order
      } else {
        delete fetchParams[col.sort.prop]
      }
    })
    const paginationInfo = unref(getPagination)
    if (paginationInfo) {
      fetchParams[fetchSetting.value.pageField] = paginationInfo.page ?? 1
      fetchParams[fetchSetting.value.sizeField] = paginationInfo.pageSize
    }
    const { fetchParams: params } = unref(propsRef.value.options)
    if (isPayload(params)) {
      Object.assign(fetchParams, params)
    }
  }

  // 获取表格数据
  const fetchTableData = async () => {
    const { api, beforeFetch, afterFetch } = unref(propsRef.value.options)
    if (!api || !isFunction(api)) return
    try {
      setLoading(true)
      initFetchParams()
      let params = fetchParams
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params
      }
      const res = await api(params)
      const paginationInfo = unref(getPagination)
      if (paginationInfo) {
        tableData.value = get(res, fetchSetting.value.listField)
        total.value = get(res, fetchSetting.value.totalField)
        setPagination({ total: total.value })
      } else {
        tableData.value = get(res, fetchSetting.value.noPaginationListField)
      }
      if (afterFetch && isFunction(afterFetch)) {
        tableData.value = (await afterFetch(tableData.value)) || tableData.value
      }
      emit('fetchSuccess', {
        tableData: unref(tableData.value),
        total: unref(total.value),
      })
    } catch (error) {
      console.error('🚀 ~ fetchTableData ~ error:', error)
      emit('fetchError', error)
    } finally {
      setLoading(false)
    }
  }

  const search = formData => {
    Object.assign(fetchParams, formData)
    fetchParams[fetchSetting.value.pageField] = 1
    fetchTableData()
  }

  const refresh = (formData?: any) => {
    isPayload(formData) && Object.assign(fetchParams, formData)
    fetchTableData()
  }

  return {
    fetchSetting,
    tableData,
    search,
    refresh,
  }
}
