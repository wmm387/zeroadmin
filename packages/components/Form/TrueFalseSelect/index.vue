<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'
import { computed } from 'vue'

const { modelValue, onOff, booleanValue, placeholder = '请选择', widthFull = true } = defineProps<{
  modelValue: number | string | boolean
  onOff?: boolean
  booleanValue?: boolean
  placeholder?: string
  widthFull?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => modelValue,
  set: (val: number | string | boolean) => {
    emit('update:modelValue', val)
  },
})

const activeText = computed(() => onOff ? '开' : '是')

const inactiveText = computed(() => onOff ? '关' : '否')

const activeValue = computed(() => booleanValue ? true : 1)

const inactiveValue = computed(() => booleanValue ? false : 0)
</script>

<template>
  <ElSelect
    v-model="value"
    :placeholder="placeholder"
    :class="{ 'w-full': widthFull }"
    clearable
  >
    <ElOption :value="activeValue" :label="activeText" />
    <ElOption :value="inactiveValue" :label="inactiveText" />
  </ElSelect>
</template>
