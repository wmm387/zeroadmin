<script setup lang="ts">
import type { TableInstance } from 'element-plus'
import type {
  Column,
  Options,
  SearchColumn,
  SlotType,
  TableActionType,
  TablePropsType,
} from './types'
import { isDef } from '@pkg/utils'
import { useTimeoutFn } from '@vueuse/core'
import { ElCard, ElCollapseTransition, ElTable, ElTableColumn, ElTooltip } from 'element-plus'
import { merge } from 'lodash-es'
import { computed, onMounted, provide, ref, unref, useSlots } from 'vue'
import { RenderColumn, SortDropdown, ZActionButton, ZCrudSetting, ZSearch } from './components'
import { defaultOptions } from './defaultData'
import {
  useAction,
  useFetchData,
  usePagination,
  useRowSelection,
  useSearch,
  useTableColumn,
  useTableSort,
} from './hooks'

interface PropsType {
  options?: Options
  searchColumns?: SearchColumn[]
  columns?: Column[]
}

const props = defineProps<PropsType>()

const emit = defineEmits([
  'fetchSuccess',
  'fetchError',
  'selectionChange',
  'sortChange',
  'register',
  'row-click',
  'row-dbClick',
  'row-contextmenu',
  'edit-end',
  'edit-cancel',
  'edit-change',
  'expanded-rows-change',
])

const tableRef = ref<TableInstance>()

const ZCrudSlot = useSlots()
provide('ZCrudSlot', ZCrudSlot)

const innerPropsRef = ref<Partial<Options>>()

const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) } as TablePropsType
})

const setProps = (props: Partial<TablePropsType>) => {
  innerPropsRef.value = merge(
    {},
    { options: defaultOptions() },
    unref(innerPropsRef),
    props,
  )
}

const getOptions = computed(() => {
  return Object.assign(defaultOptions(), getProps.value.options)
})

const mainClassName = computed(() => {
  const { pageFixed } = unref(getProps).options
  if (isDef(pageFixed) && !pageFixed) {
    return 'z-crud-table-card'
  } else {
    return 'z-crud-full-table-card'
  }
})

const loading = ref(false)
const setLoading = val => {
  loading.value = val
}

const {
  searchColumns: searchColumnList,
  searchColumnDefaultOptions,
  mountSearch,
  showSearch,
  toggleSearch,
  searchSlots,
  searchRef,
  getFieldsValue,
  setFieldsValue,
  removeFieldsValue,
  resetFields,
} = useSearch(getProps)

const { getPagination, setPagination } = usePagination(getProps)

const { tableData, search, refresh } = useFetchData(
  getProps,
  {
    setLoading,
    getPagination,
    setPagination,
    getFieldsValue,
  },
  emit,
)

const { getHeaderActions, getColumnActions } = useAction(getProps)

const {
  columnsRef,
  getColumns,
  getActionColumn,
  setColumns,
  toDefaultColumns,
} = useTableColumn(getProps, getColumnActions, getPagination)

const { sortColumns, sortChange } = useTableSort(
  columnsRef,
  setFieldsValue,
  removeFieldsValue,
  refresh,
  emit,
)

const {
  selectedRowRef,
  handleSelectionChange,
  getSelectRows,
  getSelectRowKeys,
  setSelectedRows,
  delSelectedRows,
  clearSelection,
  toggleRowSelection,
} = useRowSelection(getProps, tableRef, emit)

const tableAction: Partial<TableActionType> = {
  refresh,
  setProps,
  setLoading,
  setColumns,
  getSelectRows: () => unref(getSelectRows),
  getSelectRowKeys: () => unref(getSelectRowKeys),
  setSelectedRows,
  delSelectedRows,
  clearSelection,
  toggleRowSelection,
  getFieldsValue,
  setFieldsValue,
  removeFieldsValue,
  resetFields,
  getTableData: () => unref(tableData),
  emit,
}

emit('register', tableAction)

const settingRef = ref()
const openSetting = () => {
  settingRef.value.open()
}

onMounted(() => {
  useTimeoutFn(() => {
    getOptions.value.immediate && refresh()
  }, 16)
})

defineExpose({ refresh, setLoading })
</script>

<template>
  <div class="z-crud-container">
    <ElCard :class="mainClassName">
      <ElCollapseTransition>
        <div v-if="mountSearch" v-show="showSearch" class="table-search">
          <ZSearch
            ref="searchRef"
            :columns="searchColumnList"
            :inline-btn="getOptions.searchBtnInline"
            :default-options="searchColumnDefaultOptions"
            @search="search"
          >
            <template
              v-for="slot in searchSlots"
              :key="slot"
              #[slot]="{ form, item }"
            >
              <slot
                :name="`__search_${slot}`"
                v-bind="{ form, item } as SlotType"
              />
            </template>
          </ZSearch>
        </div>
      </ElCollapseTransition>
      <slot name="__before_table" />
      <div class="mb-3 flex-bc">
        <div class="flex-cc">
          <slot name="__before_table_header_action" />
          <slot name="__table_header_action">
            <ZActionButton
              v-for="(act, index) in getHeaderActions"
              :key="`key_${act.position}_${index}_${act.text}`"
              :action="act"
              @refresh="refresh"
              @set-loading="setLoading"
            />
          </slot>
          <slot name="__after_table_header_action" />
          <div v-if="selectedRowRef.length" class="ml-3 text-sm text-placeholder">
            已选择 {{ selectedRowRef.length }} 项数据
          </div>
        </div>
        <div class="flex-cc">
          <slot name="__before_table_header_setting" />
          <SortDropdown v-if="sortColumns?.length" :columns="sortColumns" @change="sortChange" />
          <ElTooltip content="刷新表格" placement="top">
            <div class="ml-5 cursor-pointer text-info" @click="refresh">
              <div i-ep-refresh-right />
            </div>
          </ElTooltip>
          <ElTooltip
            v-if="mountSearch"
            :content="showSearch ? '隐藏搜索' : '显示搜索'"
            placement="top"
          >
            <div class="ml-5 cursor-pointer text-info" @click="toggleSearch">
              <div i-carbon-search />
            </div>
          </ElTooltip>
          <ElTooltip content="表格设置" placement="top">
            <div class="ml-5 cursor-pointer text-info" @click="openSetting">
              <div i-carbon-settings />
            </div>
          </ElTooltip>
          <slot name="__after_table_header_setting" />
        </div>
      </div>
      <ElTable
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        :row-key="getOptions.rowKey"
        :stripe="getOptions.stripe"
        :border="getOptions.border"
        :size="getOptions.size"
        :fit="getOptions.fit"
        :show-header="getOptions.showHeader"
        :highlight-current-row="getOptions.highlightCurrentRow"
        :default-expand-all="getOptions.defaultExpandAll"
        :expand-row-keys="getOptions.expandRowKeys"
        :tooltip-options="getOptions.tooltipOptions"
        :show-summary="getOptions.showSummary"
        :sum-text="getOptions.sumText"
        :summary-method="getOptions.summaryMethod"
        class-name="z-crud-table"
        header-row-class-name="z-crud-table-header-row"
        cell-class-name="z-crud-table-cell"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <template v-for="(column, index) in getColumns">
          <RenderColumn
            v-if="column.show"
            :key="`key_${index}_${column.label}_${column.prop}_${column.fixed}`"
            :column="column"
            @refresh="refresh"
          />
        </template>
        <ElTableColumn
          v-if="getActionColumn"
          :label="getActionColumn.label"
          :width="getActionColumn.width"
          :fixed="getActionColumn.fixed ? 'right' : false"
        >
          <template #default="{ row, column, $index }">
            <slot
              name="__operation_column"
              v-bind="{ row, column, index: $index } as SlotType"
            >
              <ZActionButton
                v-for="(act, index) in getColumnActions"
                :key="`key_${act.position}_${index}_${act.text}`"
                :action="act"
                :row="row"
                @refresh="refresh"
                @set-loading="setLoading"
              />
            </slot>
          </template>
        </ElTableColumn>
      </ElTable>
      <slot name="__after_table" />
      <Pagination
        v-if="getPagination"
        :page="getPagination.page"
        :page-size="getPagination.pageSize"
        :total="getPagination.total"
        @update:page="setPagination({ page: $event })"
        @update:page-size="setPagination({ pageSize: $event })"
        @on-change="refresh"
      />
    </ElCard>
    <ZCrudSetting
      ref="settingRef"
      :options="getOptions"
      :columns="getColumns"
      @set-columns="setColumns"
      @to-default="toDefaultColumns"
    />
  </div>
</template>

<style lang="scss">
@use './style.scss';
</style>
