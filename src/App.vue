<script setup lang="ts">
import { ref } from 'vue'
import { useZCrud } from '@pkg/index'
import { ElRule, option2Map } from '@pkg/utils'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { demoApi } from '@/api'

// const currentItem = ref({
//   checkboxList: [1, 2, 3],
//   radio: 1,
//   select: 2,
//   keyword: '',
//   match: 0,
//   number: 1,
//   tags: [],
//   trueFalseSelect: 1,
//   trueFalseSwitch: false,
//   dates: ['2024-03-20 00:00:00', '2024-03-22 23:59:59'],
// })

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
  <ElConfigProvider :locale="zhCn">
    <div p-4 bg="#f5f5f5">
      <ZCrud @register="register" />
    </div>
    <!-- <div p-4 flexc-cc space-y-4>
      <BasePagination :total="100" />
      <BaseCheckbox v-model="currentItem.checkboxList" :options="options" button />
      <BaseRadio v-model="currentItem.radio" :options="options" />
      <BaseSelect v-model="currentItem.select" :options="options" w="!220px" />
      <FuzzyOrMatchInput v-model="currentItem.keyword" v-model:match="currentItem.match" />
      <NumberInput v-model="currentItem.number" style="width: 220px" />
      <TagInput v-model:tags="currentItem.tags" />
      <TrueFalseSelect v-model="currentItem.trueFalseSelect" on-off w="!220px" />
      <TrueFalseSwitch v-model="currentItem.trueFalseSwitch" boolean-value />
      <CopyText content="Hello, World!" />
      <DateRangePickerWithQuick v-model="currentItem.dates" />
    </div> -->
  </ElConfigProvider>
</template>
