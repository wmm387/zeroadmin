<script setup lang="ts">
import { computed } from 'vue'
import { ElPagination } from 'element-plus'

const {
  total = 0,
  page = 1,
  pageSize = 20,
  small,
  disabled,
  pageSizeOption = [10, 20, 50, 100, 200],
} = defineProps<{
  total?: number
  page?: number
  pageSize?: number
  small?: boolean
  disabled?: boolean
  pageSizeOption?: number[]
}>()

const emit = defineEmits(['update:page', 'update:page-size', 'onChange'])

const totalPages = computed(() => {
  return Math.ceil(total / pageSize) || 1
})

const currentChange = currentPage => {
  emit('update:page', currentPage)
  emit('onChange')
}

const sizeChange = pageSize => {
  emit('update:page-size', pageSize)
  emit('update:page', 1)
  emit('onChange')
}
</script>

<template>
  <div class="pagination flex-ec">
    <ElPagination
      layout="total,sizes,prev,next,jumper"
      :total="total"
      :small="small"
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="pageSizeOption"
      :disabled="disabled"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
    <div class="total-page flex-cc" :class="{ 'text-sm': small }">
      <span class="mx-1">/</span>
      <span>{{ totalPages }}</span>
      <span class="ml-1">页</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  .total-page {
    font-weight: 400;
    color: var(--el-text-color-regular);
  }
}
::v-deep(.el-pagination) {
  .el-pagination__goto,
  .el-pagination__classifier {
    display: none;
  }

  .btn-next {
    margin-left: 0.5rem;
  }

  .btn-prev,
  .btn-next {
    border: 1px solid var(--el-border-color);
    border-radius: 2px;
  }
  .btn-prev:hover,
  .btn-next:hover {
    border-color: var(--el-pagination-hover-color);
  }
  button.is-disabled,
  button:disabled {
    border-color: var(--el-border-color) !important;
  }
}
</style>
