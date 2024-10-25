import type { PropType } from 'vue'
import { defineComponent, useSlots } from 'vue'
import { ElDescriptions, ElDescriptionsItem } from 'element-plus'

interface DescData {
  label: string
  value: any
  slot?: string
  rowspan?: number
}

const Descriptions = defineComponent({
  name: 'Descriptions',
  props: {
    column: {
      type: Number,
      required: true,
    },
    data: {
      type: Array as PropType<DescData[]>,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    border: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const slots = useSlots()
    const cellWidth = `${50 / props.column}%`

    return () => {
      return (
        <ElDescriptions
          title={props.title}
          border={props.border}
          column={props.column}
        >
          {props.data.map(item => (
            <ElDescriptionsItem
              key={item.label}
              label={item.label}
              rowspan={item.rowspan}
              width={cellWidth}
              v-slots={{
                default: () => {
                  const slot = slots?.[item.slot] as any
                  return slot ? slot(item) : (item.value ?? '--')
                },
              }}
            >
            </ElDescriptionsItem>
          ))}
        </ElDescriptions>
      )
    }
  },
})

export default Descriptions
