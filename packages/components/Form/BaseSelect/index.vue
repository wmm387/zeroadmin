<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'
import { computed } from 'vue'
import { get } from 'lodash-es'

interface PropsType {
  options: Recordable[]
  valueField?: string
  labelField?: string
  disabledField?: string
  clearable?: boolean
  multiple?: boolean
  filterable?: boolean
  objectValue?: boolean
  valueKey?: string
  widthFull?: boolean
  labelFormatter?: (option: any) => string | number
  valueFormatter?: (option: any) => any
  disabledFormatter?: (option: any) => boolean
  emptyText?: string
}

const {
  options,
  valueField = 'value',
  labelField = 'label',
  disabledField = 'disabled',
  filterable = true,
  clearable = true,
  multiple = false,
  objectValue = false,
  widthFull = true,
  valueKey,
  labelFormatter,
  valueFormatter,
  disabledFormatter,
  emptyText = '无数据',
} = defineProps<PropsType>()

const modelValue = defineModel<number | string | Recordable | Recordable[]>()

const getValueKey = computed(() => {
  if (valueKey) {
    return valueKey
  } else {
    return valueField
  }
})

const getOptions = computed(() => {
  return options.map(option => {
    return {
      label: labelFormatter ? labelFormatter(option) : get(option, labelField),
      value: objectValue ? option : valueFormatter ? valueFormatter(option) : get(option, valueField),
      disabled: disabledFormatter ? disabledFormatter(option) : get(option, disabledField),
    }
  })
})
</script>

<template>
  <ElSelect
    v-model="modelValue"
    :value-key="getValueKey"
    :filterable="filterable"
    :clearable="clearable"
    :multiple="multiple"
    :class="{ 'w-full': widthFull }"
  >
    <template #empty>
      <slot name="empty">
        <p class="el-select-dropdown__empty">
          {{ emptyText }}
        </p>
      </slot>
    </template>
    <ElOption
      v-for="item in getOptions"
      :key="item.value"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    >
      <slot name="option" :option="item">
        {{ item.label }}
      </slot>
    </ElOption>
  </ElSelect>
</template>
