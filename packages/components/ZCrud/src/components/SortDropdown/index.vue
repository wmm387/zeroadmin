<script setup lang="ts">
import type { SortColumn, SortColumnOptions } from '../../types/column'
import { Radio } from '@pkg/components'
import { ElButton, ElPopover } from 'element-plus'
import { computed } from 'vue'

const { columns } = defineProps<{ columns: SortColumn[] }>()

const emit = defineEmits<{ change: [{ prop: string, sort: SortColumnOptions }] }>()

const options = [
  { label: '升', value: 'asc' },
  { label: '降', value: 'desc' },
  { label: '无', value: '' },
]
const optionMap = { asc: '升序', desc: '降序' }

const text = computed(() => {
  const res = columns
    .filter(item => item.sort?.order)
    .map(item => `${item.sort?.label}：${optionMap[item.sort?.order]}`)
    .join('，')
  return res || '选择排序'
})

const change = (item, value) => {
  item.sort.order = value
  emit('change', { prop: item.prop, sort: item.sort })
}
</script>

<template>
  <ElPopover trigger="click" popper-class="!w-max">
    <template #reference>
      <ElButton plain size="small">
        {{ text }}
      </ElButton>
    </template>
    <div space-y-3>
      <div v-for="col in columns" :key="col.prop" flex-ec>
        <label>{{ col.sort?.label }}：</label>
        <Radio
          v-model="col.sort.order"
          :options
          button
          size="small"
          @change="change(col, $event)"
        />
      </div>
    </div>
  </ElPopover>
</template>
