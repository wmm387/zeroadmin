import type { Column } from '../../types'
import { TextTooltip } from '@pkg/components'
import { isFunction } from '@pkg/utils'
import { ElTooltip } from 'element-plus'
import { h, inject } from 'vue'

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
  let showEdit = false
  if (isFunction(column.edit?.show)) {
    showEdit = column.edit.show.length === 0 ? column.edit.show() : true
  } else {
    showEdit = column.edit?.show
  }

  if (column?.header?.showOverflowTooltip === false) {
    return (
      <div class="flex-cc">
        {showEdit ? <div class="i-ep-edit mr-1 size-4 !text-primary" /> : null}
        <span>{column.label}</span>
      </div>
    )
  } else {
    return (
      <div style={{ maxWidth: column.sortable ? 'calc(100% - 24px)' : '100%' }}>
        <TextTooltip
          content={column.label}
          v-slots={{
            prefix: () => {
              return showEdit ? <div class="i-ep-edit inline size-4 !text-primary" /> : null
            },
            extend: () => {
              return column.header?.tooltip
                ? (
                    <ElTooltip content={column.header.tooltip} placement="top">
                      <div class="i-ep-info-filled size-4 text-info" />
                    </ElTooltip>
                  )
                : null
            },
          }}
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
