<script setup lang="ts">
import { ElInput } from 'element-plus'
import { ref } from 'vue'

const { clearable = true } = defineProps<{
  append?: string
  clearable?: boolean
}>()

defineEmits(['input', 'change'])

const modelValue = defineModel<number | string | null>()

const onkeydown = e => {
  const prohibitInput = ['e', 'E']
  if (prohibitInput.includes(e.key)) {
    e.preventDefault()
  }
}

const inputRef = ref()
const focus = () => {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <ElInput
    ref="inputRef"
    v-model="modelValue"
    type="number"
    :onkeydown="onkeydown"
    :clearable="clearable"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
  >
    <template v-if="append" #append>
      <slot name="append">
        {{ append }}
      </slot>
    </template>
  </ElInput>
</template>

<style lang="scss">
// 去除input中type=number时的箭头
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
