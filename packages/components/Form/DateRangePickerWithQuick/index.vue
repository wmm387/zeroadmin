<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { type DateModelType, ElDatePicker, ElOption, ElSelect } from 'element-plus'
import { dateUtil, isEmpty, yesterday } from '@pkg/utils'

const { withTime = true, hasShortcut } = defineProps<{
  withTime?: boolean
  hasShortcut?: boolean
}>()

const emit = defineEmits<{ change: [value: DateModelType[]] }>()

const modelValue = defineModel<any[]>() as unknown as Ref<[DateModelType, DateModelType]>

const timeKey = ref()

const startTimeFormat = withTime ? 'YYYY-MM-DD 00:00:00' : 'YYYY-MM-DD'
const endTimeFormat = withTime ? 'YYYY-MM-DD 23:59:59' : 'YYYY-MM-DD'

const today = dateUtil()

let weekDay = today
if (today.day() === 0) {
  // 今天是星期天,减去一天,变成上周(周日为周起始天)
  weekDay = today.subtract(1, 'day')
}

const quickTimeList = {
  today: [
    today.format(startTimeFormat),
    today.format(endTimeFormat),
  ],
  yesterday: [
    yesterday(startTimeFormat),
    yesterday(endTimeFormat),
  ],
  last7: [
    dateUtil().subtract(6, 'day').format(startTimeFormat),
    today.format(endTimeFormat),
  ],
  last30: [
    dateUtil().subtract(29, 'day').format(startTimeFormat),
    today.format(endTimeFormat),
  ],
  week: [
    weekDay.day(1).format(startTimeFormat),
    today.format(endTimeFormat),
  ],
  lastWeek: [
    weekDay.day(-6).format(startTimeFormat),
    weekDay.day(0).format(endTimeFormat),
  ],
  month: [
    dateUtil().date(1).format(startTimeFormat),
    today.format(endTimeFormat),
  ],
  lastMonth: [
    dateUtil().subtract(1, 'month').startOf('month').format(startTimeFormat),
    dateUtil().subtract(1, 'month').endOf('month').format(endTimeFormat),
  ],
  all: [],
}

const timeShortcuts = [
  { text: '今天', key: 'today', value: quickTimeList.today },
  { text: '昨天', key: 'yesterday', value: quickTimeList.yesterday },
  { text: '近7天', key: 'last7', value: quickTimeList.last7 },
  { text: '近30天', key: 'last30', value: quickTimeList.last30 },
  { text: '本周', key: 'week', value: quickTimeList.week },
  { text: '上周', key: 'lastWeek', value: quickTimeList.lastWeek },
  { text: '本月', key: 'month', value: quickTimeList.month },
  { text: '上月', key: 'lastMonth', value: quickTimeList.lastMonth },
  { text: '全部', key: 'all', value: quickTimeList.all },
]

const canChangeKey = ref(true)

const quickTimeChange = val => {
  canChangeKey.value = false
  modelValue.value = quickTimeList[val]
}

const dateChange = () => {
  canChangeKey.value = true
}

watch(
  () => modelValue.value,
  val => {
    emit('change', val)
    if (isEmpty(val)) timeKey.value = 'all'
    if (!canChangeKey.value) {
      canChangeKey.value = true
      return
    }
    timeKey.value = ''
    if (val) {
      for (const key in quickTimeList) {
        if (Object.prototype.hasOwnProperty.call(quickTimeList, key)) {
          const element = quickTimeList[key]
          if (val.toString() === element.toString()) {
            timeKey.value = key
            break
          }
        }
      }
    }
  },
  {
    immediate: true,
  },
)

const getAttr = (): Recordable => {
  const attr = {
    type: 'daterange',
    popperClass: 'shortcut-date-popper-class',
    startPlaceholder: '开始',
    endPlaceholder: '结束',
    clearable: true,
    editable: false,
    valueFormat: 'YYYY-MM-DD',
    defaultTime: [new Date(2000, 1, 1), new Date(2000, 2, 1)] as [Date, Date],
    shortcuts: hasShortcut ? timeShortcuts : [],
  }
  if (withTime) {
    attr.valueFormat = 'YYYY-MM-DD HH:mm:ss'
    attr.defaultTime = [
      new Date(2000, 1, 1, 0, 0, 0),
      new Date(2000, 2, 1, 23, 59, 59),
    ]
  }
  return attr
}
</script>

<template>
  <div flex :class="hasShortcut ? 'shortcut-date-range' : 'select-date-range'">
    <ElDatePicker v-model="modelValue" v-bind="getAttr()" @change="dateChange" />
    <ElSelect
      v-if="!hasShortcut"
      v-model="timeKey"
      popper-class="select-date-range-popper"
      @change="quickTimeChange"
    >
      <ElOption
        v-for="time in timeShortcuts"
        :key="time.key"
        :value="time.key"
        :label="time.text"
      />
    </ElSelect>
  </div>
</template>

<style scoped lang="scss">
.shortcut-date-range {
  ::v-deep(.el-date-editor) {
    width: 220px !important;

    .el-range__icon {
      display: none;
    }
  }
}

.select-date-range {
  ::v-deep(.el-date-editor) {
    width: 220px !important;
    border-radius: 4px 0 0 4px !important;

    .el-range__icon {
      display: none;
    }
  }

  ::v-deep(.el-select) {
    width: 75px !important;

    .el-select__wrapper {
      border-radius: 0 4px 4px 0 !important;
      box-shadow: -0.5px 0 0 1px
        var(--el-input-border-color, var(--el-border-color)) inset;
    }

    .el-select__caret {
      display: none;
    }
  }
}
</style>

<style lang="scss">
.shortcut-date-popper-class {
  .el-date-range-picker {
    width: 670px;
  }

  .el-picker-panel__body-wrapper {
    display: flex;
    flex-direction: row-reverse;

    .el-picker-panel__sidebar {
      right: 0;
      width: 80px;
      border-left: 1px solid var(--el-border-color-light);
    }

    .el-picker-panel__sidebar + .el-picker-panel__body {
      margin-left: 0;
      margin-right: 80px;
    }
  }
}

.select-date-range-popper {
  .el-select-dropdown__wrap {
    max-height: 100%;
  }
}
</style>
