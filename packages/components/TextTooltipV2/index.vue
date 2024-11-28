<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { ElTooltip } from 'element-plus'
import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue'

const { content, ellipsisPosition = 'end' } = defineProps<{
  content?: string | number
  ellipsisPosition?: 'start' | 'middle' | 'end'
}>()

const _content = computed(() => content?.toString() || '')

const slots = useSlots()
const hasPrefix = computed(() => Object.keys(slots).includes('prefix'))
const hasExtend = computed(() => Object.keys(slots).includes('extend'))

const disabled = ref(true)
const text = ref(_content.value)
const rootRef = ref<HTMLElement>()

// 克隆容器元素，并设置样式以进行省略计算
const cloneContainer = () => {
  if (!rootRef.value || !rootRef.value.isConnected) return
  const originStyle = window.getComputedStyle(rootRef.value)
  const container = document.createElement('div')
  const styleNames: string[] = Array.prototype.slice.apply(originStyle)
  styleNames.forEach(name => container.style.setProperty(name, originStyle.getPropertyValue(name)))
  container.style.position = 'fixed'
  container.style.zIndex = '-9999'
  container.style.top = '-9999px'
  container.style.height = 'auto'
  container.style.minHeight = 'auto'
  container.style.maxWidth = 'auto'
  container.textContent = _content.value || ''
  document.body.appendChild(container)
  return container
}

// 计算省略文本
const calcEllipsisText = (container: HTMLDivElement, maxWidth: number) => {
  const dots = '...'
  const end = _content.value.length
  const middle = (0 + end) >> 1

  const calcStartOrEnd = (left: number, right: number): string => {
    if (right - left <= 1) {
      if (ellipsisPosition === 'end') {
        return _content.value.slice(0, left) + dots
      }
      return dots + _content.value.slice(right, end)
    }

    const middle = Math.round((left + right) / 2)

    // 设置截断位置
    if (ellipsisPosition === 'end') {
      container.textContent = _content.value.slice(0, middle) + dots
    } else {
      container.textContent = dots + _content.value.slice(middle, end)
    }

    // 截断后宽度仍不符合要求
    if (container.scrollWidth > maxWidth) {
      if (ellipsisPosition === 'end') {
        return calcStartOrEnd(left, middle)
      }
      return calcStartOrEnd(middle, right)
    }

    if (ellipsisPosition === 'end') {
      return calcStartOrEnd(middle, right)
    }

    return calcStartOrEnd(left, middle)
  }

  const calcMiddle = (leftPart: [number, number], rightPart: [number, number]): string => {
    if (leftPart[1] - leftPart[0] <= 1 && rightPart[1] - rightPart[0] <= 1) {
      return _content.value.slice(0, leftPart[0]) + dots + _content.value.slice(rightPart[1], end)
    }

    const leftMiddle = Math.floor((leftPart[0] + leftPart[1]) / 2)
    const rightMiddle = Math.ceil((rightPart[0] + rightPart[1]) / 2)

    container.textContent = _content.value.slice(0, leftMiddle) + dots + _content.value.slice(rightMiddle, end)

    if (container.scrollWidth > maxWidth) {
      return calcMiddle([leftPart[0], leftMiddle], [rightMiddle, rightPart[1]])
    }

    return calcMiddle([leftMiddle, leftPart[1]], [rightPart[0], rightMiddle])
  }

  return ellipsisPosition === 'middle' ? calcMiddle([0, middle], [middle, end]) : calcStartOrEnd(0, end)
}

const calcEllipsis = async () => {
  const container = cloneContainer()
  if (!container) return
  container.textContent = _content.value || ''
  await nextTick()
  const maxWidth = container.clientWidth
  if (container.scrollWidth > maxWidth) {
    disabled.value = false
    text.value = calcEllipsisText(container, maxWidth)
  } else {
    disabled.value = true
    text.value = _content.value
  }
  document.body.removeChild(container)
}

const { width } = useWindowSize()

watch(
  () => [_content.value, width.value],
  () => {
    text.value = _content.value
    nextTick(calcEllipsis)
  },
)

onMounted(() => {
  nextTick(calcEllipsis)
})
</script>

<template>
  <div
    v-if="_content"
    max-w-fit
    w-full
    flex-sc
  >
    <slot name="prefix" />
    <ElTooltip
      effect="dark"
      placement="top"
      popper-class="max-w-500px"
      :content="_content"
      :disabled
    >
      <div
        ref="rootRef"
        overflow-hidden
        whitespace-nowrap
        :class="{ 'ml-1': hasPrefix, 'mr-1': hasExtend }"
      >
        <slot>{{ text }}</slot>
      </div>
    </ElTooltip>
    <slot name="extend" />
  </div>
</template>
