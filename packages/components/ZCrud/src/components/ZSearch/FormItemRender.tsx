import type { SearchColumn } from '../../types'
import { DateRangePicker, FuzzyOrMatchInput } from '@pkg/components'
import { definePropType, isArray } from '@pkg/utils'
import { ElFormItem, ElInput, ElOption, ElSelect } from 'element-plus'
import { defineComponent, inject } from 'vue'
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

    const search = () => {
      emit('search')
    }

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
      switch (item.component) {
        case 'input':
          return genInputRender(item)
        case 'select':
          return genSelectRender(item)
        case 'dateRange':
          return genDateRangeRender(item)
        case 'fuzzyInput':
          return genFuzzyInput(item)
        default:
          return genInputRender(item)
      }
    }
    // input
    function genInputRender(item: SearchColumn) {
      return (
        <ElFormItem {...item}>
          <ElInput
            v-model={searchForm[item.prop]}
            placeholder={item.placeholder ?? `请输入${item.label}`}
            clearable={true}
            onKeyup={e => e.keyCode === 13 && search()}
            {...item.componentAttr}
          />
        </ElFormItem>
      )
    }
    // select
    function genSelectRender(item: SearchColumn) {
      const options = isArray(item.options) ? item.options : []
      return (
        <ElFormItem {...item}>
          <ElSelect
            v-model={searchForm[item.prop]}
            placeholder={item.placeholder ?? `请选择${item.label}`}
            filterable={true}
            clearable={true}
            {...item.componentAttr}
          >
            {options?.map(option => (
              <ElOption key={option.value} label={option.label} value={option.value} />
            ))}
          </ElSelect>
        </ElFormItem>
      )
    }
    // dateRange
    function genDateRangeRender(item: SearchColumn) {
      return (
        <ElFormItem {...item}>
          <DateRangePicker v-model={searchForm[item.prop]} {...item.componentAttr} />
        </ElFormItem>
      )
    }
    // 精确模糊
    function genFuzzyInput(item: SearchColumn) {
      return (
        <ElFormItem {...item}>
          <FuzzyOrMatchInput
            v-model={searchForm[item.prop]}
            v-model:match={searchForm[item.fuzzyAttr.field]}
            placeholder={item.placeholder ?? `请输入${item.label}`}
            {...item.componentAttr}
            onKeyup={e => e.keyCode === 13 && search()}
          />
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
