<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div mb-4 flex-sc>
    <div h-3 w-1 bg-primary />
    <span text="sm w-semibold" ml-1>{{ title }}</span>
  </div>
</template>
