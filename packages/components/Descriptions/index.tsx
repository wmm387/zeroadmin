import { definePropType } from '@pkg/utils'
import { ElDescriptions, ElDescriptionsItem } from 'element-plus'
import { defineComponent, useSlots } from 'vue'

export interface DescriptionItem {
  label: string
  value: any
  slot?: string
  span?: number
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
      type: definePropType<DescriptionItem[]>(Array),
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
          v-slots={{
            title: () => slots?.title ? slots?.title() : props.title,
            extra: () => slots?.extra ? slots?.extra() : null,
          }}
        >
          {props.data.map(item => (
            <ElDescriptionsItem
              key={item.label}
              label={item.label}
              span={item.span}
              rowspan={item.rowspan}
              width={cellWidth}
              v-slots={{
                default: () => {
                  const slot = slots?.[item.slot] as any
                  return slot ? slot(item) : (item.value ?? '--')
                },
              }}
            />
          ))}
        </ElDescriptions>
      )
    }
  },
})

export default Descriptions
