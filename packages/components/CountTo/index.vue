<script setup lang="ts">
import type { PropType } from 'vue'
import { isNumber } from '@pkg/utils'
import { computed, onMounted, reactive, unref, watch } from 'vue'

const props = defineProps({
  startVal: {
    type: Number,
    default: 0,
  },
  endVal: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 1500,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  decimals: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    validator(value: number) {
      return value >= 0
    },
  },
  color: {
    type: String,
  },
  fontSize: {
    type: String,
  },
  decimal: {
    type: String,
    default: '.',
  },
  separator: {
    type: String,
    default: ',',
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  useEasing: {
    type: Boolean,
    default: true,
  },
  easingFn: {
    type: Function as PropType<
      (t: number, b: number, c: number, d: number) => number
    >,
    default(t: number, b: number, c: number, d: number) {
      return (c * (-(2 ** ((-10 * t) / d)) + 1) * 1024) / 1023 + b
    },
  },
})

const emit = defineEmits(['mounted', 'callback'])

function formatNumber(num: number | string) {
  const { decimals, decimal, separator, suffix, prefix } = props
  num = Number(num).toFixed(decimals)
  num += ''
  const x = num.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? decimal + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  if (separator && !isNumber(separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, `$1${separator}$2`)
    }
  }
  return prefix + x1 + x2 + suffix
}

const state = reactive<{
  localStartVal: number
  printVal: number | null
  displayValue: string
  paused: boolean
  localDuration: number | null
  startTime: number | null
  timestamp: number | null
  rAF: any
  remaining: number | null
  color: string
  fontSize: string
}>({
  localStartVal: props.startVal,
  displayValue: formatNumber(props.startVal),
  printVal: null,
  paused: false,
  localDuration: props.duration,
  startTime: null,
  timestamp: null,
  remaining: null,
  rAF: null,
  color: null,
  fontSize: '16px',
})

const getCountDown = computed(() => {
  return props.startVal > props.endVal
})

watch([() => props.startVal, () => props.endVal], () => {
  if (props.autoplay) {
    start()
  }
})

function count(timestamp: number) {
  const { useEasing, easingFn, endVal } = props
  if (!state.startTime) state.startTime = timestamp
  state.timestamp = timestamp
  const progress = timestamp - state.startTime
  state.remaining = (state.localDuration as number) - progress
  if (useEasing) {
    if (unref(getCountDown)) {
      state.printVal
        = state.localStartVal
        - easingFn(
          progress,
          0,
          state.localStartVal - endVal,
          state.localDuration as number,
        )
    } else {
      state.printVal = easingFn(
        progress,
        state.localStartVal,
        endVal - state.localStartVal,
        state.localDuration as number,
      )
    }
  } else {
    if (unref(getCountDown)) {
      state.printVal
        = state.localStartVal
        - (state.localStartVal - endVal)
        * (progress / (state.localDuration as number))
    } else {
      state.printVal
        = state.localStartVal
        + (endVal - state.localStartVal)
        * (progress / (state.localDuration as number))
    }
  }
  if (unref(getCountDown)) {
    state.printVal = state.printVal < endVal ? endVal : state.printVal
  } else {
    state.printVal = state.printVal > endVal ? endVal : state.printVal
  }
  state.displayValue = formatNumber(state.printVal)
  if (progress < (state.localDuration as number)) {
    state.rAF = requestAnimationFrame(count)
  } else {
    emit('callback')
  }
}

function start() {
  const { startVal, duration, color, fontSize } = props
  state.localStartVal = startVal
  state.startTime = null
  state.localDuration = duration
  state.paused = false
  state.color = color
  state.fontSize = fontSize
  state.rAF = requestAnimationFrame(count)
}

function pauseResume() {
  if (state.paused) {
    resume()
    state.paused = false
  } else {
    pause()
    state.paused = true
  }
}

function pause() {
  cancelAnimationFrame(state.rAF)
}

function resume() {
  state.startTime = null
  state.localDuration = +(state.remaining as number)
  state.localStartVal = +(state.printVal as number)
  requestAnimationFrame(count)
}

function reset() {
  state.startTime = null
  cancelAnimationFrame(state.rAF)
  state.displayValue = formatNumber(props.startVal)
}

onMounted(() => {
  if (props.autoplay) {
    start()
  }
  emit('mounted')
})

defineExpose({ start, pauseResume, pause, resume, reset })
</script>

<template>
  <span :style="{ color, fontSize }">
    {{ state.displayValue }}
  </span>
</template>
