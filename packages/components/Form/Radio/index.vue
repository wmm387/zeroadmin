<script setup lang="ts">
import { useBreakpoint } from '@pkg/hooks'
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElRadio, ElRadioButton, ElRadioGroup } from 'element-plus'
import { get } from 'lodash-es'
import { computed } from 'vue'

const {
  options,
  valueField = 'value',
  labelField = 'label',
  labelFormatter,
  valueFormatter,
  button,
  xs,
} = defineProps<{
  options: Recordable[]
  valueField?: string
  labelField?: string
  labelFormatter?: (option: any) => string | number
  valueFormatter?: (option: any) => any
  button?: boolean
  xs?: boolean
}>()

const modelValue = defineModel<number | string | boolean>()

const childComponent = button ? ElRadioButton : ElRadio

const getOptions = computed(() => {
  return options.map(option => {
    return {
      label: labelFormatter ? labelFormatter(option) : get(option, labelField),
      value: valueFormatter ? valueFormatter(option) : get(option, valueField),
    }
  })
})

const { smallerThanSm } = useBreakpoint()

const modelValueLabel = computed(() => {
  return getOptions.value.find(item => item.value === modelValue.value)?.label
})

const dropdownChange = value => {
  modelValue.value = value
}
</script>

<template>
  <ElDropdown v-if="smallerThanSm && xs">
    <ElButton type="primary" :size="xs ? 'small' : 'default'">
      <div flex-cc>
        {{ modelValueLabel }}
        <div i-ep-arrow-down ml-2 />
      </div>
    </ElButton>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="item in getOptions"
          :key="item.value"
          @click="dropdownChange(item.value)"
        >
          {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
  <ElRadioGroup v-else v-model="modelValue">
    <component
      :is="childComponent"
      v-for="item in getOptions"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    />
  </ElRadioGroup>
</template>
