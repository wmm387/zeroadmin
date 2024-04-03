import { h, inject } from 'vue'

/**
 * 自定义渲染列
 * @param props 列配置
 * @constructor
 */
const SlotColumn = props => {
  const ZCrudSlot = inject('ZCrudSlot') as any

  const slotProps = {
    row: props.row,
    column: props.column,
    index: props.index,
  }

  /**
   * 根据slot渲染多层级
   */
  const renderCell = () => {
    const column = props.column
    const slot = ZCrudSlot?.[column.slot] as any
    return h('div', { class: 'base-cell' }, slot ? slot(slotProps) : null)
  }
  return renderCell()
}

SlotColumn.props = {
  row: Object,
  index: Number,
  column: {
    type: Object,
    default: null,
  },
}
export default SlotColumn
