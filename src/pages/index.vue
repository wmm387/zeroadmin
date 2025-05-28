<script setup lang="ts">
import { DatePicker } from '@pkg/components'
import { ElButton } from 'element-plus'
import { ref } from 'vue'

const currentItem = ref({
  checkboxList: [1, 2, 3],
  radio: 'android',
  select: 2,
  keyword: '',
  match: 0,
  number: 1,
  tags: [],
  trueFalseSelect: 1,
  trueFalseSwitch: false,
  dates: ['2024-03-20 00:00:00', '2024-03-22 23:59:59'],
  date: '',
})

const options = [
  { label: 'PC', value: 1 },
  { label: 'H5', value: 2 },
  { label: '小程序', value: 3 },
]

const platformList = [
  { value: 'android', label: '安卓' },
  { value: 'ios', label: 'iOS' },
]

const logValue = () => {
  console.log(currentItem.value)
}
</script>

<template>
  <div
    bg="#fbfbfb"
    p-4
    flexc-cc
    space-y-4
  >
    <Checkbox v-model="currentItem.checkboxList" :options="options" button />
    <Radio v-model="currentItem.radio" :options="platformList" button />
    <Select v-model="currentItem.select" :options="options" w="!220px" />
    <FuzzyOrMatchInput v-model="currentItem.keyword" v-model:match="currentItem.match" />
    <NumberInput v-model="currentItem.number" style="width: 220px" />
    <TagInput v-model:tags="currentItem.tags" />
    <TrueFalseSelect v-model="currentItem.trueFalseSelect" on-off w="!220px" />
    <TrueFalseSwitch v-model="currentItem.trueFalseSwitch" boolean-value />
    <DateRangePicker v-model="currentItem.dates" />
    <DatePicker v-model="currentItem.date" />
    <ElButton type="primary" @click="logValue">
      获取
    </ElButton>
  </div>
</template>
