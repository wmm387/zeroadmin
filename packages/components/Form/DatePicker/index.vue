<script setup lang="ts">
import { useBreakpoint } from '@pkg/hooks'
import { ElDatePicker } from 'element-plus'
import { computed } from 'vue'

interface Props {
  type?: 'year' | 'years' | 'month' | 'months' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange' | 'yearrange'
  valueFormat?: string
  startPlaceholder?: string
  endPlaceholder?: string
  defaultTime?: Date | [Date, Date]
  clearable?: boolean
  editable?: boolean
  shortcuts?: Array<{ text: string, value: Date | Fn }>
  popperClass?: string
}

const {
  type = 'date',
  valueFormat,
  defaultTime,
  clearable = true,
  editable = false,
  startPlaceholder = '开始',
  endPlaceholder = '结束',
  shortcuts,
} = defineProps<Props>()

const _valueFormat = computed(() => {
  if (valueFormat) {
    return valueFormat
  }
  switch (type) {
    case 'year':
    case 'years':
    case 'yearrange':
      return 'YYYY'
    case 'month':
    case 'months':
    case 'monthrange':
      return 'YYYY-MM'
    case 'date':
    case 'dates':
    case 'daterange':
      return 'YYYY-MM-DD'
    case 'datetime':
    case 'datetimerange':
      return 'YYYY-MM-DD HH:mm:ss'
    case 'week':
      return '第ww周'
    default:
      return ''
  }
})

const modelValue = defineModel<Arrayable<string>>()

const { smallerThanSm } = useBreakpoint()

const getAttr = (): Props => {
  const attr: Props = {
    popperClass: `z-date-picker-popper ${smallerThanSm.value ? 'xs' : 'normal'}`,
    type,
    valueFormat: _valueFormat.value,
    clearable,
    editable,
    startPlaceholder,
    endPlaceholder,
    defaultTime,
    shortcuts,
  }
  if (type.endsWith('range')) {
    attr.startPlaceholder = attr.startPlaceholder || '开始'
    attr.endPlaceholder = attr.endPlaceholder || '结束'
    attr.defaultTime = attr.defaultTime || [
      new Date(2000, 1, 1, 0, 0, 0),
      new Date(2000, 2, 1, 23, 59, 59),
    ]
  }
  return attr
}
</script>

<template>
  <ElDatePicker v-model="modelValue" class="z-date-picker" v-bind="getAttr()" />
</template>

<style lang="scss">
.z-date-picker {
  width: 220px !important;

  .el-range__icon {
    display: none;
  }

  .el-range__close-icon {
    margin-left: 1px;
  }
}

.z-date-picker-popper {
  .el-picker-panel {
    max-width: 300px;

    .el-picker-panel__body-wrapper {
      .el-picker-panel__body {
        margin-left: 0;

        .el-date-picker__time-header {
          padding: 4px 5px 5px;
        }

        .el-picker-panel__content {
          padding: 0px 12px 6px;
          margin: auto;
        }

        .el-picker-panel__icon-btn {
          margin: 0 5px;
          font-size: 14px;
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

    &.has-sidebar {
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

      .el-picker-panel__body {
        .el-date-picker__header {
          padding-top: 8px;
        }
      }
    }

    .el-picker-panel__footer {
      padding: 5px 12px 4px;
    }
  }

  &.normal {
    .el-date-range-picker {
      max-width: 580px !important;

      .el-picker-panel__content {
        padding: 10px 12px !important;
      }

      &.has-sidebar,
      &.has-time {
        .el-picker-panel__content {
          padding: 6px 12px !important;
        }
      }
    }

    .el-picker-panel {
      .el-picker-panel__body-wrapper {
        .el-picker-panel__sidebar {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          padding-top: 8px;
          border-bottom: 1px solid var(--el-border-color-light);

          .el-picker-panel__shortcut {
            margin-left: 8px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }

  &.xs {
    .el-picker-panel {
      &.el-date-range-picker {
        .el-picker-panel__content {
          width: 100%;
          padding: 10px 12px;
        }
      }

      .el-picker-panel__body-wrapper {
        .el-picker-panel__body {
          min-width: 100%;

          .el-date-range-picker__time-header {
            display: flex;
            flex-direction: column;

            .el-icon {
              display: none;
            }
          }

          .el-picker-panel__content {
            width: 100%;

            &.is-left {
              border-right-width: 0;
              border-bottom: 1px solid var(--el-border-color-light);
            }
          }
        }
      }
    }

    .has-sidebar {
      max-width: 340px;

      .el-picker-panel__sidebar {
        right: 0;
        width: initial;
        padding: 0 8px 8px;
        border-left: 1px solid var(--el-border-color-light);

        .el-picker-panel__shortcut {
          margin-top: 8px;
        }
      }

      .el-picker-panel__body {
        padding-right: 70px;

        .el-date-picker__header {
          padding-top: 12px;
        }
      }
    }
  }
}
</style>
