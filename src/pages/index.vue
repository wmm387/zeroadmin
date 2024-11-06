<script setup lang="ts">
import { Pagination } from '@pkg/components'
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
</script>

<template>
  <div
    bg="#fbfbfb"
    p-4
    flexc-cc
    space-y-4
  >
    <Pagination :total="100" />
    <Checkbox v-model="currentItem.checkboxList" :options="options" button />
    <Radio v-model="currentItem.radio" :options="platformList" button />
    <Select v-model="currentItem.select" :options="options" w="!220px" />
    <FuzzyOrMatchInput v-model="currentItem.keyword" v-model:match="currentItem.match" />
    <NumberInput v-model="currentItem.number" style="width: 220px" />
    <TagInput v-model:tags="currentItem.tags" />
    <TrueFalseSelect v-model="currentItem.trueFalseSelect" on-off w="!220px" />
    <TrueFalseSwitch v-model="currentItem.trueFalseSwitch" boolean-value />

    <CopyText content="https://cck-pms.oss-cn-shanghai.aliyuncs.com/certs/20240829/1724897558444_66cfd9166c59d.crt" />
    <!-- <TextTooltip content="https://cck-pms.oss-cn-shanghai.aliyuncs.com/certs/20240829/1724897558444_66cfd9166c59d.crt" />
    <TextTooltipV2 content="https://cck-pms.oss-cn-shanghai.aliyuncs.com/certs/20240829/1724897558444_66cfd9166c59d.crt" />
    <TextTooltip content="省略号可以用于引文的省略，列举的省略，说话断断续续，也可以用于表示节省原文或语句未完、意思未尽等" />
    <TextTooltipV2 content="省略号可以用于引文的省略，列举的省略，说话断断续续，也可以用于表示节省原文或语句未完、意思未尽等" ellipsis-position="start" /> -->
    <DateRangePicker v-model="currentItem.dates" />
  </div>
</template>
