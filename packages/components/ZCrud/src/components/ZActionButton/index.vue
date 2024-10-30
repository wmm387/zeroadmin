<script setup lang="ts">
import type { ActionBtn, ActionBtnPopconfirm } from '../../types'
import { isAsyncFn, isFunction, isPromise } from '@pkg/utils'
import { ElButton, ElPopconfirm } from 'element-plus'
import { computed, ref } from 'vue'

interface PropsType {
  action: ActionBtn
  row?: any
}

const props = defineProps<PropsType>()

const emit = defineEmits(['refresh', 'setLoading'])

const btnLoading = ref(false)

const popconfirmInfo = computed(() => {
  return props.action?.popconfirm as ActionBtnPopconfirm
})

const btnAttr = computed(() => {
  const attr = { type: props.action.color, size: props.action.size }
  props.action.btnType && (attr[props.action.btnType] = true)
  return attr
})

const handleShow = () => {
  if (isFunction(props.action.show)) {
    return props.action.show(props.row ?? null)
  }
  return true
}

const handleDisabled = () => {
  if (isFunction(props.action.disabled)) {
    return props.action.disabled(props.row ?? null)
  } else {
    return props.action.disabled
  }
}

const handleAsync = async params => {
  const { showLoading = true, doRefresh = 'after', showBtnLoading, handle } = props.action
  showLoading && emit('setLoading', true)
  showBtnLoading && (btnLoading.value = true)
  try {
    return await handle(...params)
  } catch (err) {
    console.error('🚀 ~ z-crud ~ action ~ err:', {
      action: props.action,
      params,
      err,
    })
    doRefresh === 'error' && emit('refresh')
  } finally {
    showLoading && emit('setLoading', false)
    showBtnLoading && (btnLoading.value = false)
    doRefresh === 'after' && emit('refresh')
  }
}

const handleAction = async e => {
  const params = []
  props.row && params.push(props.row)
  params.push(e)

  const { handle, isAsync } = props.action
  if (isAsync || isAsyncFn(handle) || isPromise(handle)) {
    return handleAsync(params)
  }
  return handle(...params)
}
</script>

<template>
  <template v-if="handleShow()">
    <ElPopconfirm
      v-if="popconfirmInfo"
      :confirm-button-text="popconfirmInfo?.okText"
      :cancel-button-text="popconfirmInfo?.cancelText"
      :icon="popconfirmInfo?.icon"
      :title="popconfirmInfo?.title"
      :width="popconfirmInfo?.width"
      @cancel="popconfirmInfo?.cancel"
      @confirm="handleAction"
    >
      <template #reference>
        <ElButton v-bind="btnAttr" :loading="btnLoading" :disabled="handleDisabled()">
          {{ props.action?.text }}
        </ElButton>
      </template>
    </ElPopconfirm>
    <ElButton
      v-else
      v-bind="btnAttr"
      :loading="btnLoading"
      :disabled="handleDisabled()"
      @click="handleAction"
    >
      {{ props.action?.text }}
    </ElButton>
  </template>
</template>
