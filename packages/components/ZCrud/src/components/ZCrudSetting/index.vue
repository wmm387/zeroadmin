<script setup lang="ts">
import { ElButton, ElDrawer, ElTable, ElTableColumn } from 'element-plus'
import { BaseRadio, NumberInput, TrueFalseSwitch } from '@pkg/components'
import Sortable from 'sortablejs'
import { computed, nextTick, ref } from 'vue'
import type { Column } from '../../types'

const props = defineProps<{ columns: Column[] }>()

const emit = defineEmits(['setColumns', 'toDefault'])

const columnData = computed(() => {
  return props.columns.map(item => {
    item.width ?? (item.width = null)
    item.minWidth ?? (item.minWidth = null)
    return item
  })
})

const fixedOptions = [
  { label: '左', value: 'left' },
  { label: '无', value: false },
  { label: '右', value: 'right' },
]

const visible = ref(false)
const loading = ref(false)

// 打开抽屉
const open = () => {
  visible.value = true
  nextTick(() => {
    const tbody = document.querySelector('.z-crud-setting-table .el-table__body-wrapper tbody')
    Sortable.create(tbody, {
      handle: '.drag-icon',
      animation: 200,
      ghostClass: 'ghost',
      onEnd({ newIndex, oldIndex }) {
        const currRow = columnData.value.splice(oldIndex, 1)[0]
        columnData.value.splice(newIndex, 0, currRow)
        emit('setColumns', columnData.value)
      },
    })
  })
}

const toDefault = () => {
  emit('toDefault')
}

const changeColumn = () => {
  emit('setColumns', columnData.value)
}

defineExpose({ open })
</script>

<template>
  <ElDrawer v-model="visible" :size="850" destroy-on-close>
    <template #header>
      <div class="flex-1">
        <span>表格设置</span>
        <ElButton
          type="primary"
          class="ml-4"
          size="small"
          @click="toDefault"
        >
          恢复默认
        </ElButton>
      </div>
    </template>
    <ElTable
      v-loading="loading"
      class-name="z-crud-setting-table z-table"
      :data="columnData"
      :row-key="row => `${row.label}-${row.prop}`"
    >
      <ElTableColumn width="50">
        <div i-carbon-drag-vertical class="drag-icon cursor-pointer" />
      </ElTableColumn>
      <ElTableColumn label="列名称" prop="label" show-overflow-tooltip />
      <ElTableColumn v-slot="{ row }" label="列宽度" width="150">
        <NumberInput
          v-model="row.width"
          placeholder="列宽度"
          clearable
          @change="changeColumn"
        />
      </ElTableColumn>
      <ElTableColumn v-slot="{ row }" label="最小宽度" width="150">
        <NumberInput
          v-model="row.minWidth"
          placeholder="最小宽度"
          clearable
          @change="changeColumn"
        />
      </ElTableColumn>
      <ElTableColumn v-slot="{ row }" label="是否展示" width="100">
        <TrueFalseSwitch
          v-model="row.show"
          boolean-value
          @change="changeColumn"
        />
      </ElTableColumn>
      <ElTableColumn
        v-slot="{ row }"
        label="固定"
        prop="fixed"
        width="160"
      >
        <BaseRadio
          v-model="row.fixed"
          size="small"
          button
          :options="fixedOptions"
          @change="changeColumn"
        />
      </ElTableColumn>
    </ElTable>
  </ElDrawer>
</template>
