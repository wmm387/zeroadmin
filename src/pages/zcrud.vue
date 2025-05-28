<script setup lang="tsx">
import { demoApi } from '@/api'
import { ZCrud } from '@pkg/components'
import { useZCrud } from '@pkg/index'
import { ElRule, option2Map, toast } from '@pkg/utils'
import { onMounted, ref } from 'vue'

const options = [
  { label: 'PC', value: 1 },
  { label: 'H5', value: 2 },
  { label: '小程序', value: 3 },
]
const optionsMap = option2Map(options)

const genderList = ref([])
const getGenderList = async () => {
  const { data } = await demoApi.genderList()
  genderList.value = data
  return data
}

const [register] = useZCrud(
  {
    options: {
      key: 'admin-list-123',
      api: demoApi.list,
      pageFixed: true,
      actions: [
        { special: 'create', handle: () => toast.success('创建') },
        { special: 'update', handle: row => toast.success(row) },
        { special: 'delete', handle: () => toast.warning('删除') },
      ],
    },
    searchColumns: [
      {
        label: '关键字',
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
        options: 'onOrOff',
      },
      {
        label: '创建时间',
        prop: 'times',
        component: 'dateRange',
      },
      {
        label: '性别',
        prop: 'gender',
        options: getGenderList,
        minor: true,
      },
      {
        label: '排序',
        prop: 'sort',
        minor: true,
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
        click: () => toast.success('123'),
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
        sort: { label: '年龄' },
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
        sort: true,
        minWidth: 160,
      },
      {
        label: '生日',
        prop: 'birthday',
        sort: { prop: 'birthday_sort', default: 'desc' },
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
          show: row => row.id !== 1,
          component: 'numberInput',
          rules: ElRule.isPositiveInt(true),
        },
        width: 150,
      },
      {
        label: '状态',
        prop: 'status',
        edit: { component: 'onOffSwitch' },
        width: 120,
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
