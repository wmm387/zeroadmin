<script setup lang="ts">
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup } from 'element-plus'
import { get } from 'lodash-es'
import { computed } from 'vue'

const {
  modelValue,
  options,
  valueField = 'value',
  labelField = 'label',
  labelFormatter,
  valueFormatter,
  button,
} = defineProps<{
  modelValue: number[] | string[] | any[]
  options: Recordable[]
  valueField?: string
  labelField?: string
  labelFormatter?: (option: any) => string | number
  valueFormatter?: (option: any) => any
  button?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => modelValue,
  set: (val: number[] | string[] | any[]) => {
    emit('update:modelValue', val)
  },
})

const childComponent = button ? ElCheckboxButton : ElCheckbox

const getOptions = computed(() => {
  return options.map(option => {
    return {
      label: labelFormatter ? labelFormatter(option) : get(option, labelField),
      value: valueFormatter ? valueFormatter(option) : get(option, valueField),
    }
  })
})
</script>

<template>
  <ElCheckboxGroup v-model="value">
    <component
      :is="childComponent"
      v-for="item in getOptions"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    />
  </ElCheckboxGroup>
</template>
