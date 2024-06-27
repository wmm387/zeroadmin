import { h, inject } from 'vue'
import { ElTooltip } from 'element-plus'
import { TextTooltip } from '@pkg/components'
import type { Column } from '../../types'

const TableSlotHeader = props => {
  const ZCrudSlot = inject('ZCrudSlot') as any

  return h(
    'span',
    {},
    ZCrudSlot?.[props.column.slotHeader]
      ? ZCrudSlot?.[props.column.slotHeader]({ column: props.column, scope: props.scope })
      : null,
  )
}

TableSlotHeader.props = {
  column: {
    type: Object,
    default: null,
  },
  scope: {
    type: Object,
    default: null,
  },
}

const renderHeader = (column: Column) => {
  if (column?.header?.showOverflowTooltip === false) {
    return (
      <span>
        {column.label}
        {
          (column.edit || column?.header?.edit)
            ? (<div class="i-ep-edit ml-1 inline h-4 w-4 !text-primary" />)
            : null
        }
      </span>
    )
  } else {
    const slots = {} as { prefix: any }
    if (column?.edit || column?.header?.edit || column?.header?.tooltip) {
      slots.prefix = () => {
        return (
          <div>
            {
              (column.edit || column?.header?.edit)
                ? (<div class="i-ep-edit h-4 w-4 !text-primary" />)
                : null
            }
            {
              column.header?.tooltip
                ? (
                  <ElTooltip content={column.header.tooltip} placement="top">
                    <div class="i-ep-info-filled h-4 w-4 text-info" />
                  </ElTooltip>
                  )
                : null
            }
          </div>
        )
      }
    }
    return (
      <div style={{ maxWidth: column.sortable ? 'calc(100% - 24px)' : '100%' }}>
        <TextTooltip
          content={column.label}
          v-slots={slots}
        />
      </div>
    )
  }
}

const columnHeaderSlot = (column: Column) => scope => {
  if (column?.header?.render) {
    // scope为 table-column Scoped Slot 自定义表头的内容. 参数为 {column, $index}
    return column.header.render(column, scope)
  } else {
    if (column?.header?.slot) {
      return <TableSlotHeader column={column} scope={scope} />
    }
    return renderHeader(column)
  }
}

export default columnHeaderSlot
