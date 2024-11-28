<script setup lang="ts">
import { TextTooltip } from '@pkg/components'
import { useCopy } from '@pkg/hooks'
import { ElButton } from 'element-plus'

defineProps<{ content?: string | number }>()

const { copy } = useCopy()
</script>

<template>
  <TextTooltip :content="content">
    <template #extend>
      <ElButton link type="primary" @click="copy(content)">
        <div i-ep-copy-document />
      </ElButton>
    </template>
  </TextTooltip>
</template>
