<script setup lang="ts">
import { ElButton, ElInput, ElTag } from 'element-plus'
import { nextTick, ref } from 'vue'
import { toast } from '@pkg/utils'

const tags = defineModel<string[]>('tags')

const inputValue = ref('')
const inputVisible = ref(false)

const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string) => {
  tags.value.splice(tags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  const tag = inputValue.value.trim()
  if (tag) {
    if (tags.value.includes(tag)) {
      toast.warning('标签已存在')
    } else {
      tags.value.push(tag)
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>

<template>
  <div>
    <ElTag
      v-for="tag in tags"
      :key="tag"
      closable
      mx-1
      @close="handleClose(tag)"
    >
      {{ tag }}
    </ElTag>
    <ElInput
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="ml-1 !w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <ElButton
      v-else
      ml-1
      type="primary"
      size="small"
      @click="showInput"
    >
      + 添加
    </ElButton>
  </div>
</template>
