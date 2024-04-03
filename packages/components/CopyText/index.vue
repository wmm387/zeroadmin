<script setup lang="ts">
import { ElButton } from 'element-plus'
import { TextTooltip } from '@pkg/components'
import { useCopy } from '@pkg/hooks'

defineProps<{ content?: string }>()

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
