<script setup lang="ts">
import { ElRadio, ElRadioButton, ElRadioGroup } from 'element-plus'
import { computed } from 'vue'
import { get } from 'lodash-es'

const {
  modelValue,
  options,
  valueField = 'value',
  labelField = 'label',
  labelFormatter,
  valueFormatter,
  button,
} = defineProps<{
  modelValue: number | string | boolean
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
  set: (val: number | string | boolean) => {
    emit('update:modelValue', val)
  },
})

const childComponent = button ? ElRadioButton : ElRadio

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
  <ElRadioGroup v-model="value">
    <component
      :is="childComponent"
      v-for="item in getOptions"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    />
  </ElRadioGroup>
</template>
