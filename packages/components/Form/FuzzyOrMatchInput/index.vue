<script setup lang="ts">
import { ElInput, ElOption, ElSelect } from 'element-plus'

const { placeholder = '请输入' } = defineProps<{ placeholder?: string }>()

const emit = defineEmits(['input', 'change'])

const modelValue = defineModel<string | null>()
const match = defineModel<number>('match', { default: 0 })
</script>

<template>
  <div class="fuzzy-or-match-input flex">
    <ElInput
      v-model="modelValue"
      clearable
      :placeholder="placeholder"
      @input="emit('input', $event)"
      @change="emit('change', $event)"
    />
    <ElSelect v-model="match" :teleported="false">
      <ElOption label="精确" :value="1" />
      <ElOption label="模糊" :value="0" />
    </ElSelect>
  </div>
</template>

<style scoped lang="scss">
.fuzzy-or-match-input {
  ::v-deep(.el-input) {
    width: 160px !important;
    .el-input__wrapper {
      border-radius: 4px 0 0 4px !important;
    }
  }

  ::v-deep(.el-select) {
    width: 60px !important;

    .el-select__wrapper {
      border-radius: 0 4px 4px 0 !important;
      box-shadow: -0.5px 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    }

    .el-select__caret {
      display: none;
    }
  }
}
</style>
