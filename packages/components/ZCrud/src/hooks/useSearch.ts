import type { ComputedRef } from 'vue'
import type { SearchColumn, SearchRefType, TablePropsType } from '../types'
import { isDef, isFunction } from '@pkg/utils'
import { computed, ref, unref } from 'vue'

const handleShow = (item: SearchColumn) => {
  if (isDef(item.show)) {
    if (isFunction(item.show)) {
      return item.show(item)
    } else {
      return item.show
    }
  } else {
    return true
  }
}

export function useSearch(propsRef: ComputedRef<TablePropsType>) {
  const searchColumns = computed(() => {
    return unref(propsRef.value.searchColumns)?.filter(item => handleShow(item))
  })

  const searchColumnDefaultOptions = computed(() => {
    return unref(propsRef.value.options.searchColumnDefaultOptions)
  })

  const mountSearch = computed(() => searchColumns.value?.length)

  const showSearch = ref(true)
  const toggleSearch = () => showSearch.value = !showSearch.value

  const searchSlots = computed(() => {
    const sls = []
    unref(propsRef.value.searchColumns)?.forEach(item => {
      if (item.slot) sls.push(item.slot)
    })
    return sls
  })

  const searchRef = ref<SearchRefType>()

  const getFieldsValue = () => searchRef.value?.getFieldsValue()

  const setFieldsValue = (values: Recordable) => searchRef.value?.setFieldsValue(values)

  const resetFields = () => searchRef.value?.resetFields()

  return {
    searchColumns,
    searchColumnDefaultOptions,
    mountSearch,
    showSearch,
    toggleSearch,
    searchSlots,
    searchRef,
    getFieldsValue,
    setFieldsValue,
    resetFields,
  }
}
