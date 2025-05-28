<script setup lang="ts">
import type { DateModelType } from 'element-plus'
import type { Ref } from 'vue'
import { useBreakpoint } from '@pkg/hooks'
import { dateUtil, yesterday } from '@pkg/utils'
import { ElDatePicker } from 'element-plus'

const { withTime = true } = defineProps<{ withTime?: boolean }>()

const modelValue = defineModel<any[]>() as unknown as Ref<[DateModelType, DateModelType]>

const startTimeFormat = withTime ? 'YYYY-MM-DD 00:00:00' : 'YYYY-MM-DD'
const endTimeFormat = withTime ? 'YYYY-MM-DD 23:59:59' : 'YYYY-MM-DD'

const today = dateUtil()

let weekDay = today
if (today.day() === 0) {
  // 今天是星期天,减去一天,变成上周(周日为周起始天)
  weekDay = today.subtract(1, 'day')
}

const quickTimeList = {
  today: [today.format(startTimeFormat), today.format(endTimeFormat)],
  yesterday: [yesterday(startTimeFormat), yesterday(endTimeFormat),
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
  all: ['', ''],
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

const { smallerThanSm } = useBreakpoint()

const getAttr = (): Recordable => {
  const attr = {
    type: 'daterange',
    popperClass: `z-shortcut-date-popper ${smallerThanSm.value ? 'xs' : 'normal'}`,
    startPlaceholder: '开始',
    endPlaceholder: '结束',
    clearable: true,
    editable: false,
    valueFormat: 'YYYY-MM-DD',
    defaultTime: [new Date(2000, 1, 1), new Date(2000, 2, 1)] as [Date, Date],
    shortcuts: timeShortcuts,
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
  <ElDatePicker v-model="modelValue" class="z-shortcut-date-range" v-bind="getAttr()" />
</template>

<style lang="scss">
.z-shortcut-date-range {
  width: 220px !important;

  .el-range__icon {
    display: none;
  }

  .el-range__close-icon {
    margin-left: 1px;
  }
}

.z-shortcut-date-popper {
  .el-date-range-picker {
    .el-picker-panel__body-wrapper {
      .el-picker-panel__sidebar {
        .el-picker-panel__shortcut {
          width: initial;
          border: 1px solid var(--el-border-color-light);
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          line-height: 16px;

          &:hover {
            border-color: var(--el-color-primary);
          }
        }
      }

      .el-picker-panel__sidebar + .el-picker-panel__body {
        margin-left: 0;

        .el-picker-panel__content {
          padding: 6px 12px;
        }

        .el-date-range-picker__header {
          .el-picker-panel__icon-btn {
            max-height: 28px;
            width: 12px;
            margin: 0 5px;
            font-size: 14px;
          }

          div {
            height: 28px;
          }
        }

        .el-date-table {
          th {
            padding: 4px;
          }

          .el-date-table__row {
            td {
              padding: 2px 0;
            }
          }
        }
      }
    }
  }

  &.normal {
    .el-date-range-picker {
      max-width: 580px;

      .el-picker-panel__body-wrapper {
        .el-picker-panel__sidebar {
          position: relative;
          display: flex;
          width: 100%;
          padding: 8px 0;
          border-bottom: 1px solid var(--el-border-color-light);

          .el-picker-panel__shortcut {
            margin-left: 10px;
          }
        }
      }
    }
  }

  &.xs {
    .el-date-range-picker {
      width: 340px;

      .el-picker-panel__body-wrapper {
        display: flex;
        flex-direction: row-reverse;

        .el-picker-panel__sidebar {
          right: 0;
          width: initial;
          padding: 8px;
          border-left: 1px solid var(--el-border-color-light);

          .el-picker-panel__shortcut {
            margin-top: 8px;
          }
        }

        .el-picker-panel__sidebar + .el-picker-panel__body {
          min-width: 100%;
          padding-right: 70px;

          .el-picker-panel__content {
            width: 100%;

            &.is-left {
              border-right-width: 0;
              padding-bottom: 0;
            }
          }
        }
      }
    }
  }
}
</style>
