<script setup lang="ts">
import { time } from '@pkg/utils'
import { computed } from 'vue'

const { timeStr, type = 'time' } = defineProps<{
  timeStr?: string
  type?: 'time' | 'date'
}>()

const timeArr = computed(() => {
  return time(timeStr).split(' ')
})
</script>

<template>
  <div>
    <div v-if="timeStr">
      <div>{{ timeArr[0] }}</div>
      <div v-if="type === 'time'">
        {{ timeArr[1] }}
      </div>
    </div>
    <div v-else>
      {{ timeStr ?? '--' }}
    </div>
  </div>
</template>
