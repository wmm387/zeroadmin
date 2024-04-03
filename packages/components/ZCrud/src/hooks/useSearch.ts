import type { ComputedRef } from 'vue'
import { computed, ref, unref } from 'vue'
import type { SearchRefType, TablePropsType } from '../types'

export function useSearch(propsRef: ComputedRef<TablePropsType>) {
  const searchColumns = computed(() => unref(propsRef.value.searchColumns))

  const searchColumnDefaultOptions = computed(() => unref(propsRef.value.options.searchColumnDefaultOptions))

  const mountSearch = computed(() => searchColumns.value?.length)

  const showSearch = ref(true)
  const toggleSearch = () => {
    showSearch.value = !showSearch.value
  }

  const searchSlots = computed(() => {
    const sls = []
    searchColumns.value?.forEach(item => {
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
