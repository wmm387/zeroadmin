<script setup lang="ts">
import type { SearchColumn } from '../../types'
import { DatePicker, DateRangePicker, FuzzyOrMatchInput, Select } from '@pkg/components'
import { isFunction, isString } from '@pkg/utils'
import { ElInput } from 'element-plus'
import { inject, ref, unref, watch } from 'vue'
import { selectOptionsConst } from '../../const'

const { item } = defineProps<{ item?: SearchColumn }>()

const emit = defineEmits<{ search: [] }>()

const searchForm = inject('zSearchForm') as any

const getCompAttr = () => {
  const attrs: Recordable = {}
  if (['input', 'fuzzyInput'].includes(item.component)) {
    attrs.placeholder = item.placeholder ?? `请输入${item.label}`
    attrs.onKeyup = e => e.keyCode === 13 && emit('search')
    attrs.clearable = true
  } else if (item.component === 'select') {
    attrs.placeholder = item.placeholder ?? `请选择${item.label}`
    attrs.filterable = true
    attrs.clearable = true
    attrs.options = []
  } else if (item.component === 'date') {
    attrs.placeholder = item.placeholder ?? `请选择${item.label}`
  }
  return Object.assign({}, attrs, item?.componentAttr)
}

const selectLoading = ref(false)
const selectOptions = ref([])

const getSelectOptions = async () => {
  if (isString(item.options)) {
    // 使用内置字典名称
    selectOptions.value = selectOptionsConst[item.options] || []
  } else if (isFunction(item.options)) {
    // 使用方法
    try {
      selectLoading.value = true
      selectOptions.value = await item.options()
    } catch (error) {
      console.error('🚀 ~ file: ComponentFormItem.vue: getSelectOptions ~ error:', error)
    } finally {
      selectLoading.value = false
    }
  } else {
    selectOptions.value = unref(item.options)
  }
}

watch(
  () => item,
  () => {
    if (item.component === 'select') {
      getSelectOptions()
    }
  },
  { immediate: true },
)
</script>

<template>
  <template v-if="item.component === 'select'">
    <Select
      v-model="searchForm[item.prop]"
      v-bind="getCompAttr()"
      :loading="selectLoading"
      :options="selectOptions"
    />
  </template>
  <template v-else-if="item.component === 'date'">
    <DatePicker v-model="searchForm[item.prop]" v-bind="getCompAttr()" />
  </template>
  <template v-else-if="item.component === 'dateRange'">
    <DateRangePicker v-model="searchForm[item.prop]" v-bind="getCompAttr()" />
  </template>
  <template v-else-if="item.component === 'fuzzyInput'">
    <FuzzyOrMatchInput
      v-model="searchForm[item.prop]"
      v-model:match="searchForm[item.fuzzyAttr.field]"
      v-bind="getCompAttr()"
    />
  </template>
  <template v-else>
    <ElInput v-model="searchForm[item.prop]" v-bind="getCompAttr()" />
  </template>
</template>
