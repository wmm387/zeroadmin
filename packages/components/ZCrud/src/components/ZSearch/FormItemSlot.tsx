import type { PropType } from 'vue'
import type { SearchColumn } from '../../types'
import { h, inject } from 'vue'

interface PropsType {
  item: SearchColumn
}

const FormItemSlot = (props: PropsType) => {
  const searchForm = inject('zSearchForm') as any
  const zSearchSlots = inject('zSearchSlots') as any
  return h(
    'div',
    {
      className: 'form-slot',
    },
    zSearchSlots[props.item.slot]
      ? zSearchSlots[props.item.slot]({ form: searchForm, item: props.item })
      : null,
  )
}

FormItemSlot.props = {
  item: {
    type: Object as PropType<SearchColumn>,
    default: null,
  },
}
export default FormItemSlot
