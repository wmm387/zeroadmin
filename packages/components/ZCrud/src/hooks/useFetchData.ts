import type { ComputedRef } from 'vue'
import type { PaginationProps, TablePropsType } from '../types'
import { isEmpty, isFunction } from '@pkg/utils'
import { get } from 'lodash-es'
import { computed, reactive, ref, unref } from 'vue'
import { defaultFetchSetting } from '../defaultData'

interface ActionType {
  setLoading: (boolean) => void
  getPagination: ComputedRef<PaginationProps>
  setPagination: (info: Partial<PaginationProps>) => void
  getFieldsValue: () => Recordable
}

export function useFetchData(
  propsRef: ComputedRef<TablePropsType>,
  { setLoading, getPagination, setPagination, getFieldsValue }: ActionType,
  emit: EmitType,
) {
  const fetchSetting = computed(() => {
    return Object.assign(defaultFetchSetting(), propsRef.value.options.fetchSetting)
  })

  const fetchParams = reactive({})

  const tableData = ref([])
  const total = ref()

  const initFetchParams = () => {
    const paginationInfo = unref(getPagination)
    if (paginationInfo) {
      fetchParams[fetchSetting.value.pageField] = paginationInfo.page ?? 1
      fetchParams[fetchSetting.value.sizeField] = paginationInfo.pageSize
    }
    const searchForm = getFieldsValue()
    if (!isEmpty(searchForm)) {
      Object.assign(fetchParams, searchForm)
    }
    const { fetchParams: params } = unref(propsRef.value.options)
    if (!isEmpty(params)) {
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
    !isEmpty(formData) && Object.assign(fetchParams, formData)
    fetchTableData()
  }

  return {
    fetchSetting,
    tableData,
    search,
    refresh,
  }
}
