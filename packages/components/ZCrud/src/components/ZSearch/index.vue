<script setup lang="ts">
import type { SearchColumn } from '../../types'
import { isArray, removeUndefined } from '@pkg/utils'
import { ElButton, ElForm, ElFormItem } from 'element-plus'
import { cloneDeep, defaultsDeep } from 'lodash-es'
import { computed, provide, reactive, ref, unref, useSlots } from 'vue'
import { defaultDateRangeField, defaultFuzzyInputAttr } from '../../defaultData'
import FormItemRender from './FormItemRender'

const props = defineProps<{
  inlineBtn?: boolean
  columns: SearchColumn[]
  defaultOptions?: Partial<SearchColumn>
}>()

const emit = defineEmits(['search', 'reset'])

const slots = useSlots()
provide('zSearchSlots', slots)

const loading = ref(false)
const formRef = ref()

const searchForm = reactive({})
provide('zSearchForm', searchForm)

const initFormData = (column: SearchColumn) => {
  switch (column.component) {
    case 'input':
      return ''
    case 'dateRange':
      return []
    default:
      return column.default
  }
}

const init = async () => {
  props.columns.forEach(async column => {
    column = defaultsDeep(column, props?.defaultOptions)
    if (!column?.component) {
      if (column?.options) {
        column.component = 'select'
      } else if (!column?.slot) {
        column.component = 'input'
      }
    }
    searchForm[column.prop] = column.default ?? initFormData(column)
    if (column.component === 'fuzzyInput') {
      // 针对fuzzyInput格式化数据
      column.fuzzyAttr = defaultsDeep({}, column?.fuzzyAttr, defaultFuzzyInputAttr)
      // 加入模糊/精确搜索字段
      searchForm[column.fuzzyAttr.field] = column.fuzzyAttr.defaultValue ?? undefined
    }
  })
}

init()

const getSearchForm = computed(() => {
  const form = cloneDeep(unref(searchForm))
  props.columns.forEach(async column => {
    if (column.component === 'dateRange') {
      // 针对dateRange格式化数据
      const { prefix, start_at, end_at } = defaultsDeep(
        {},
        column?.dateRangeField,
        defaultDateRangeField,
      )
      const prefixStr = prefix ? `${prefix}_` : ''
      form[`${prefixStr}${start_at}`] = form[column.prop]?.[0]
      form[`${prefixStr}${end_at}`] = form[column.prop]?.[1]
      Reflect.deleteProperty(form, column.prop)
    }
  })
  return form
})

// 搜索
const search = () => {
  emit('search', getSearchForm.value)
}
// 重置搜索
const reset = () => {
  formRef.value.resetFields()
  emit('search', getSearchForm.value)
}

const getFieldsValue = () => {
  return removeUndefined(getSearchForm.value)
}

const setFieldsValue = async values => {
  Object.assign(searchForm, values)
}

const removeFieldsValue = (fields: string | string[]) => {
  fields = isArray(fields) ? fields : [fields]
  fields.forEach(field => {
    Reflect.deleteProperty(searchForm, field)
  })
}

const resetFields = () => {
  formRef.value.resetFields()
}

defineExpose({
  searchForm,
  getFieldsValue,
  setFieldsValue,
  removeFieldsValue,
  resetFields,
})
</script>

<template>
  <ElForm
    ref="formRef"
    inline
    :model="searchForm"
    class="z-search-container"
    label-width="auto"
    @submit.prevent
  >
    <FormItemRender
      v-for="(item, index) in columns"
      :key="`key_${index}_${item.prop}`"
      :item="item"
      :title="item.label"
      @search="search"
    />
    <div :class="inlineBtn ? 'inline-block' : 'block'">
      <ElFormItem label-width="0">
        <ElButton type="primary" :loading="loading" @click="search">
          查询
        </ElButton>
        <ElButton :loading="loading" @click="reset">
          重置
        </ElButton>
      </ElFormItem>
    </div>
  </ElForm>
</template>
