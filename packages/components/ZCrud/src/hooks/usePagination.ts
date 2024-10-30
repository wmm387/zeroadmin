import type { ComputedRef } from 'vue'
import type { PaginationProps, TablePropsType } from '../types'
import { isBoolean, isDefAndNotNull } from '@pkg/utils'
import { computed, reactive, ref, unref } from 'vue'

const defaultPageSize = 20

export function usePagination(propsRef: ComputedRef<TablePropsType>) {
  const loadedRef = ref<Nullable<boolean>>(false)
  const showPagination = ref(true)

  const pagination = reactive({
    page: 1,
    pageSize: defaultPageSize,
    total: 0,
  })

  const load = () => {
    if (unref(loadedRef)) return
    const { pagination: show, pageSize } = unref(propsRef).options
    if (isBoolean(show)) {
      showPagination.value = show
    }
    if (pageSize) {
      pagination.pageSize = pageSize
    }
    loadedRef.value = true
  }

  const getPagination = computed((): PaginationProps => {
    load()
    if (!showPagination.value) return null
    return unref(pagination)
  })

  const setPagination = (info: Partial<PaginationProps>) => {
    isDefAndNotNull(info?.page) && (pagination.page = info.page)
    isDefAndNotNull(info?.pageSize) && (pagination.pageSize = info.pageSize)
    isDefAndNotNull(info?.total) && (pagination.total = info.total)
  }

  return {
    showPagination,
    getPagination,
    setPagination,
  }
}
