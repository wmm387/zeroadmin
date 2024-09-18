<script setup lang="ts">
import { ref } from 'vue'
import { useZCrud } from '@pkg/index'
import { ElRule, option2Map } from '@pkg/utils'
import { demoApi } from '@/api'

const options = [
  { label: 'PC', value: 1 },
  { label: 'H5', value: 2 },
  { label: '小程序', value: 3 },
]
const optionsMap = option2Map(options)

const dialogRef = ref()

const [register] = useZCrud(
  {
    options: {
      key: 'admin-list-123',
      api: demoApi.list,
      pageFixed: true,
      actions: [
        {
          special: 'add',
          handle: () => dialogRef.value.open(),
        },
        {
          special: 'edit',
          handle: row => dialogRef.value.open(row),
        },
      ],
    },
    searchColumns: [
      {
        label: '模糊搜索',
        prop: 'fuzzy',
        component: 'fuzzyInput',
      },
      {
        label: '用户姓名',
        prop: 'name',
      },
      {
        label: '用户状态',
        prop: 'status',
        dict: { name: 'onOrOff' },
      },
      {
        label: '创建时间',
        prop: 'times',
        component: 'dateRange',
      },
    ],
    columns: [
      {
        label: 'ID',
        prop: 'id',
        width: 70,
      },
      {
        label: '姓名',
        prop: 'name',
        minWidth: 100,
      },
      {
        label: '信息',
        prop: 'age',
        component: 'textColumn',
        componentAttr: {
          list: [
            { label: '年龄', valueKey: 'age' },
            { label: '性别', valueKey: 'gender' },
          ],
        },
        width: 120,
      },
      {
        label: '地址',
        prop: 'address',
        component: 'copyText',
        minWidth: 180,
      },
      {
        label: '头像',
        prop: 'img',
        component: 'image',
        width: 100,
      },
      {
        label: '热门',
        prop: 'is_hot',
        component: 'yesOrNoTag',
        width: 100,
      },
      {
        label: '进度',
        prop: 'progress',
        component: 'progress',
        minWidth: 150,
      },
      {
        label: '生日',
        prop: 'birthday',
        component: 'timeColumn',
        width: 120,
      },
      {
        label: '渠道',
        prop: 'channel',
        formatter: row => optionsMap[row.channel],
        edit: {
          component: 'select',
          componentAttr: { options },
        },
        width: 150,
      },
      {
        label: '排序',
        prop: 'sort',
        edit: {
          component: 'numberInput',
          rules: ElRule.isPositiveInt(true),
        },
        width: 150,
      },
      {
        label: '状态',
        prop: 'status',
        edit: { component: 'onOffSwitch' },
        width: 150,
      },
      {
        label: '时间',
        prop: 'times',
        component: 'times',
      },
    ],
  },
  {
    searchColumnDefaultOptions: {
      dateRangeField: {
        start_at: 'start_time',
        end_at: 'end_time',
      },
    },
  },
)
</script>

<template>
  <div p-4 bg="#f5f5f5">
    <ZCrud @register="register" />
  </div>
</template>
