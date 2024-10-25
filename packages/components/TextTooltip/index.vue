<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { ElTooltip } from 'element-plus'

defineProps<{ content?: string }>()

const slots = useSlots()
const hasPrefix = computed(() => Object.keys(slots).includes('prefix'))
const hasExtend = computed(() => Object.keys(slots).includes('extend'))

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
  <div
    v-if="content"
    max-w-fit
    w-full
    flex-sc
  >
    <slot name="prefix" />
    <ElTooltip
      effect="dark"
      placement="top"
      popper-class="max-w-500px"
      :content="content"
      :visible="visible"
    >
      <div truncate :class="{ 'ml-1': hasPrefix, 'mr-1': hasExtend }">
        <span @mouseenter="mouseenter" @mouseleave="mouseleave">
          <slot>{{ content }}</slot>
        </span>
      </div>
    </ElTooltip>
    <slot name="extend" />
  </div>
</template>
