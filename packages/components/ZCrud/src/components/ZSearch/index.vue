<script setup lang="ts">
import { ElButton, ElForm, ElFormItem } from 'element-plus'
import { computed, provide, reactive, ref, unref, useSlots } from 'vue'
import { cloneDeep, defaultsDeep } from 'lodash-es'
import type { SearchColumn } from '../../types'
import { selectDictList } from '../../const'
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

const formDictData = reactive({})
provide('zSearchFormDictData', formDictData)

const handlerProps = (column: SearchColumn, tmpArr) => {
  const data = {} as any
  const tran = {}
  const colors = {}
  data.list = tmpArr.map(dicItem => {
    const label = dicItem[column.dict?.props?.label || 'label']
    const tmp = dicItem[column.dict?.props?.value || 'value']
    const value = typeof tmp == 'boolean' ? `${tmp}` : tmp
    colors[value] = (column.dict.tagColors && column.dict.tagColors[value]) || undefined
    tran[value] = label
    return { label, value }
  })
  data.tran = tran
  data.colors = colors
  return data
}

const allowCoverFormType = ['radio', 'checkbox', 'select', 'transfer']

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
      if (column?.dict) {
        column.component = 'select'
      } else if (!column?.slot) {
        column.component = 'input'
      } else if (column.fuzzyAttr) {
        column.component = 'fuzzyInput'
      }
    }
    searchForm[column.prop] = column.default ?? initFormData(column)
    if (column.component === 'fuzzyInput') {
      // 针对fuzzyInput格式化数据
      column.fuzzyAttr = defaultsDeep({}, column?.fuzzyAttr, defaultFuzzyInputAttr)
      // 加入模糊/精确搜索字段
      searchForm[column.fuzzyAttr.field] = column.fuzzyAttr.defaultValue ?? undefined
    }
    if (column.dict && allowCoverFormType.includes(column.component)) {
      if (column.dict.name) {
        // 使用内置字典名称
        const dict = selectDictList[column.dict.name] || []
        formDictData[column.prop] = handlerProps(column, dict)
      } else if (column.dict.api) {
        // 使用接口
        const { data } = await column.dict.api()
        formDictData[column.prop] = handlerProps(column, data)
      } else if (column.dict.data) {
        // 使用数据
        formDictData[column.prop] = handlerProps(column, column.dict.data)
      }
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
  return getSearchForm.value
}

const setFieldsValue = async values => {
  Object.assign(searchForm, values)
}

const resetFields = () => {
  formRef.value.resetFields()
}

defineExpose({
  searchForm,
  formDictData,
  getFieldsValue,
  setFieldsValue,
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
      <ElFormItem>
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
