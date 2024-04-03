<script setup lang="ts">
import { computed } from 'vue'
import { time } from '@pkg/utils'

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
