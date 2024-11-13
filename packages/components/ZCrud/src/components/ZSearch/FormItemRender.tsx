import type { SearchColumn } from '../../types'
import { definePropType } from '@pkg/utils'
import { ElFormItem } from 'element-plus'
import { defineComponent, inject } from 'vue'
import ComponentFormItem from './ComponentFormItem.vue'
import FormItemSlot from './FormItemSlot'

const FormItemRender = defineComponent({
  name: 'FormItemRender',
  props: {
    item: {
      type: definePropType<SearchColumn>(Object),
      default: () => { },
    },
  },
  setup(props, { emit }) {
    const searchForm = inject('zSearchForm') as any

    // 自定义渲染
    function genRender(item: SearchColumn) {
      return (
        <ElFormItem
          {...item}
          v-slots={{
            default: () => {
              return item.render(searchForm, item)
            },
          }}
        />
      )
    }

    // 插槽
    function genSlot(item: SearchColumn) {
      return (
        <ElFormItem
          {...item}
          v-slots={{
            default: () => {
              return <FormItemSlot item={item} />
            },
          }}
        />
      )
    }

    // 组件类型
    function genComponent(item: SearchColumn) {
      return (
        <ElFormItem {...item}>
          <ComponentFormItem item={item} onSearch={() => emit('search')} />
        </ElFormItem>
      )
    }

    function renderFormItem(item: SearchColumn) {
      if (item.render) {
        return genRender(item)
      } else if (item.slot) {
        return genSlot(item)
      } else if (item.component) {
        return genComponent(item)
      }
    }

    return () => renderFormItem(props.item)
  },
})

export default FormItemRender
