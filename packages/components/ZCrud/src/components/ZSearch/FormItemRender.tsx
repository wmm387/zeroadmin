import { type PropType, defineComponent, inject, unref } from 'vue'
import { ElFormItem, ElInput, ElOption, ElSelect } from 'element-plus'
import { DateRangePickerWithQuick, FuzzyOrMatchInput } from '@pkg/components'
import { isDef, isFunction } from '@pkg/utils'
import type { SearchColumn } from '../../types'
import FormItemSlot from './FormItemSlot'

const FormItemRender = defineComponent({
  name: 'FormItemRender',
  props: {
    item: {
      type: Object as PropType<SearchColumn>,
      default: () => { },
    },
  },
  setup(props, { emit }) {
    const searchForm = inject('zSearchForm') as any
    const formDictData = inject('zSearchFormDictData') as any

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
      let refData = null
      if (item.dict?.refData) {
        refData = unref(item.dict.refData)
      }
      if (refData) {
        return genRefDataSelectRender(refData, item)
      }
      return (
        <ElFormItem {...item}>
          <ElSelect
            v-model={searchForm[item.prop]}
            placeholder={item.placeholder ?? `请选择${item.label}`}
            filterable={true}
            clearable={true}
            {...item.componentAttr}
          >
            {formDictData[item.prop]?.list.map(option => (
              <ElOption
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </ElSelect>
        </ElFormItem>
      )
    }
    // ref数据select
    function genRefDataSelectRender(refData, item: SearchColumn) {
      return (
        <ElFormItem {...item}>
          <ElSelect
            v-model={searchForm[item.prop]}
            placeholder={item.placeholder ?? `请选择${item.label}`}
            filterable={true}
            clearable={true}
            {...item.componentAttr}
          >
            {refData?.map(option => (
              <ElOption
                key={option[item.dict?.props?.value || 'value']}
                label={option[item.dict?.props?.label || 'label']}
                value={option[item.dict?.props?.value || 'value']}
              />
            ))}
          </ElSelect>
        </ElFormItem>
      )
    }
    // dateRange
    function genDateRangeRender(item: SearchColumn) {
      return (
        <ElFormItem {...item}>
          <DateRangePickerWithQuick
            v-model={searchForm[item.prop]}
            has-shortcut
            {...item.componentAttr}
          />
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

    function handleShow(item: SearchColumn) {
      if (isDef(item.show)) {
        if (isFunction(item.show)) {
          return item.show(item)
        } else {
          return item.show
        }
      } else {
        return true
      }
    }

    function renderFormItem(item: SearchColumn) {
      if (handleShow(item)) {
        if (item.render) {
          return genRender(item)
        } else if (item.slot) {
          return genSlot(item)
        } else if (item.component) {
          return genComponent(item)
        }
      }
    }

    return () => renderFormItem(props.item)
  },
})

export default FormItemRender
