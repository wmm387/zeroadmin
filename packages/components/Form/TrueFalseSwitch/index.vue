<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { computed } from 'vue'

const { modelValue, onOff, booleanValue, color } = defineProps<{
  modelValue: number | string | boolean
  onOff?: boolean
  booleanValue?: boolean
  color?: '' | 'green' | 'orange' | 'purple'
}>()

const emit = defineEmits(['change', 'update:modelValue'])

const value = computed({
  get: () => modelValue,
  set: (val: number | string | boolean) => {
    emit('update:modelValue', val)
  },
})

const activeText = computed(() => (onOff ? '开' : '是'))

const inactiveText = computed(() => (onOff ? '关' : '否'))

const activeValue = computed(() => (booleanValue ? true : 1))

const inactiveValue = computed(() => (booleanValue ? false : 0))

const colors = { green: '#13ce66', orange: '#e6a23c', purple: '#626aef' }

const getStyle = () => {
  if (color) {
    return `--el-switch-on-color: ${colors[color]}`
  } else {
    return ''
  }
}
</script>

<template>
  <ElSwitch
    v-model="value"
    inline-prompt
    :active-text="activeText"
    :inactive-text="inactiveText"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    :style="getStyle()"
    @change="$emit('change')"
  />
</template>
