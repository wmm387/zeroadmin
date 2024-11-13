<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'
import { get } from 'lodash-es'
import { computed } from 'vue'

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
  loading?: boolean
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
  loading,
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
    :loading="loading"
    :class="{ 'w-full': widthFull }"
    popper-class="z-select-popper"
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
    <template #loading>
      <svg class="circular" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
        />
      </svg>
    </template>
  </ElSelect>
</template>

<style lang="scss">
.z-select-popper {
  .el-select-dropdown__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    height: 100px;

    .circular {
      display: inline;
      height: 30px;
      width: 30px;
      animation: loading-rotate 2s linear infinite;
    }

    .path {
      animation: loading-dash 1.5s ease-in-out infinite;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-width: 2;
      stroke: var(--el-color-primary);
      stroke-linecap: round;
    }
  }
}

@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>
