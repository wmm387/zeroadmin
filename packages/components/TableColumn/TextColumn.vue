<script setup lang="ts">
import { ElTooltip } from 'element-plus'
import { ref } from 'vue'
import { useCopy } from '@pkg/hooks'

interface PropsType {
  label?: string
  value?: string | null | number | undefined
  copied?: boolean
}

defineProps<PropsType>()

const { copy } = useCopy()

const visible = ref(false)

const mouseenter = e => {
  const parentWidth = e.target.parentNode.offsetWidth
  const contentWidth = e.target.offsetWidth
  // 判断是否开启tooltip功能
  if (contentWidth > parentWidth) {
    visible.value = true
  } else {
    visible.value = false
  }
}

const mouseleave = () => {
  visible.value = false
}
</script>

<template>
  <ElTooltip
    effect="dark"
    placement="top"
    :content="String(value)"
    :visible="visible"
  >
    <div truncate>
      <span @mouseenter="mouseenter" @mouseleave="mouseleave">
        <span v-if="label" mr-1 text-info>{{ label }}:</span>
        <span
          v-if="copied"
          title="点击复制"
          cursor-pointer
          text-success
          @click="copy(value)"
        >{{ value || '--' }}</span>
        <span v-else>{{ value || '--' }}</span>
      </span>
    </div>
  </ElTooltip>
</template>
