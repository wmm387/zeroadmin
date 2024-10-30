<script setup lang="ts">
import { time } from '@pkg/utils'
import { computed } from 'vue'

const props = defineProps<{ timeStr?: string }>()

const timeArr = computed(() => {
  return time(props.timeStr).split(' ')
})
</script>

<template>
  <div>
    <div v-if="timeStr">
      <div>{{ timeArr[0] }}</div>
      <div>{{ timeArr[1] }}</div>
    </div>
    <div v-else>
      {{ timeStr ?? '--' }}
    </div>
  </div>
</template>
