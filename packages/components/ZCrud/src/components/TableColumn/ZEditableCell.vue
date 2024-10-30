<script setup lang="ts">
import type { Column } from '../../types'
import { ElRule, isArray, isDef, isEmpty, isFunction, toast } from '@pkg/utils'
import { ElButton, ElForm, ElFormItem, ElTooltip } from 'element-plus'
import { cloneDeep, get, set } from 'lodash-es'
import { computed, nextTick, reactive, ref, shallowRef, unref } from 'vue'
import { componentMap } from '../../componentMap'

const { row, column } = defineProps<{
  row: Recordable
  column: Column
  index: number
}>()

const emit = defineEmits(['refresh'])

const modelValue = computed({
  get: () => {
    return get(row, column.prop)
  },
  set: val => {
    set(row, column.prop, val)
  },
})

const formData = reactive({
  value: modelValue,
})

const popoverVisible = ref(false)
const popoverMsg = ref('')
const validate = (prop, isValid: boolean, message: string) => {
  if (!isValid) {
    popoverVisible.value = true
    popoverMsg.value = message
  } else {
    popoverVisible.value = false
    popoverMsg.value = ''
  }
}

const loading = ref(false)
const isEdit = ref(false)
const oldVal = ref()

const always = computed(() => {
  if (isDef(column.edit?.always)) {
    return column.edit.always
  } else if (['trueFalseSwitch', 'onOffSwitch', 'radio'].includes(column.edit.component)) {
    return true
  } else {
    return false
  }
})

// 通用格式化
const modelValueFormatter = () => {
  if (isFunction(column.formatter)) {
    return column.formatter(row, column) ?? '--'
  } else {
    return isEmpty(modelValue.value) ? '--' : modelValue.value
  }
}

const Comp = computed(() => componentMap.get(column.edit.component))

const getCompAttr = () => {
  const attrs: Recordable = {}
  if (['input', 'numberInput', 'select', 'radio'].includes(column.edit.component)) {
    attrs.size = 'small'
  }
  if (column.edit.component === 'radio') {
    attrs.size = 'small'
    attrs.button = true
  }
  if (column.edit.component === 'onOffSwitch') {
    attrs.onOff = true
  }
  return Object.assign({}, attrs, column.edit?.componentAttr)
}

const editDisabled = computed(() => {
  if (isFunction(column.edit?.disabled)) {
    return column.edit.disabled(row)
  } else {
    return column.edit?.disabled
  }
})

const rules = computed(() => {
  const valueRules = []
  column.edit?.required && valueRules.push(ElRule.isRequired())
  if (column.edit?.rules) {
    if (isArray(column.edit.rules)) {
      valueRules.push(...column.edit.rules)
    } else {
      valueRules.push(column.edit.rules)
    }
  }
  return {
    value: valueRules,
  }
})

const compRef = shallowRef()
// 开始编辑
const startEdit = () => {
  oldVal.value = cloneDeep(unref(modelValue.value))
  isEdit.value = true
  nextTick(() => {
    compRef.value?.focus && compRef.value.focus()
  })
}

// 提交
const submit = async () => {
  loading.value = true
  try {
    if (modelValue.value !== oldVal.value) {
      const value = cloneDeep(unref(modelValue.value))
      oldVal.value = value
      if (isDef(column.edit.updateFn) && isFunction(column.edit.updateFn)) {
        await column.edit.updateFn(row, column, value)
        toast.success('操作成功')
      }
    }
    isEdit.value = false
  } catch (err) {
    emit('refresh')
    console.error('🚀 ~ file: ZEditableCell.vue ~ submit ~ err:', err)
  } finally {
    loading.value = false
  }
}

// 处理值变动
const handleChange = async () => {
  if (always.value) {
    submit()
  }
}

// 取消
const cancel = () => {
  modelValue.value = cloneDeep(unref(oldVal.value))
  isEdit.value = false
}
</script>

<template>
  <div v-if="always || isEdit" flex items-center>
    <ElForm
      :model="formData"
      :rules="rules"
      flex-1
      @validate="validate"
      @submit.prevent
    >
      <ElFormItem prop="value" mb="!0">
        <ElTooltip
          :visible="!!popoverMsg"
          :content="popoverMsg"
          popper-class="text-danger!"
        >
          <component
            :is="Comp"
            ref="compRef"
            v-model="modelValue"
            v-loading="loading"
            :disabled="editDisabled"
            v-bind="getCompAttr()"
            @change="handleChange"
          />
        </ElTooltip>
      </ElFormItem>
    </ElForm>
    <div v-if="!always" flex-cc>
      <ElButton
        link
        :disabled="loading || !!popoverMsg"
        ml-0.5
        @click="submit"
      >
        <div i-ep-select class="icon" text-success />
      </ElButton>
      <ElButton
        :disabled="loading"
        link
        ml="!0.5"
        @click="cancel"
      >
        <div i-ep-close-bold class="icon" text-danger />
      </ElButton>
    </div>
  </div>
  <div
    v-else
    w-full
    flex
    items-center
  >
    <div>
      {{ modelValueFormatter() }}
    </div>
    <ElButton
      link
      ml-1
      :disabled="editDisabled"
      @click="startEdit"
    >
      <div
        class="icon edit-icon"
        i-ep-edit
        hidden
        text="!primary"
      />
    </ElButton>
  </div>
</template>

<style lang="scss">
.z-crud-table-cell {
  .el-loading-spinner {
    .circular {
      scale: 0.5 !important;
    }
  }
  .icon {
    width: 0.9rem;
    height: 0.9rem;
    &:hover {
      scale: 1.2;
    }
  }

  &:hover {
    .edit-icon {
      display: block;
    }
  }
}
</style>
