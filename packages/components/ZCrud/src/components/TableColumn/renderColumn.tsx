import type { PropType } from 'vue'
import type { Column } from '../../types'
import { ElTableColumn } from 'element-plus'
import { get } from 'lodash-es'
import { defineComponent } from 'vue'
import RenderComponentColumn from './renderComponentColumn'
import SlotColumn from './slotColumn'
import columnHeaderSlot from './slotHeader'
import ZEditableCell from './ZEditableCell.vue'

const RenderColumn = defineComponent({
  name: 'RenderColumn',
  props: {
    column: {
      type: Object as PropType<Column>,
      default: () => { },
    },
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    // 自定义渲染
    const genRender = (column) => {
      return (
        <ElTableColumn
          {...column}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row, $index }) => {
              return column.render(row, column, $index)
            },
          }}
        />
      )
    }

    // 自定义组件类型
    const getComponent = (column: Column) => {
      return <RenderComponentColumn column={column} />
    }

    // 插槽
    const genSlot = (column: Column) => {
      return (
        <ElTableColumn
          {...column}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row, $index }) => {
              return <SlotColumn row={row} column={column} index={$index} />
            },
          }}
        />
      )
    }

    // 渲染可编辑项
    const genEditableColumn = (column: Column) => {
      return (
        <ElTableColumn
          {...props.column}
          showOverflowTooltip={false}
          v-slots={{
            header: columnHeaderSlot(props.column),
            default: ({ row, $index }) => {
              return (
                <ZEditableCell
                  row={row}
                  column={column}
                  index={$index}
                  onRefresh={() => emit('refresh')}
                />
              )
            },
          }}
        />
      )
    }

    // 渲染多级表头
    const genChildren = (column) => {
      const childrenColumn = column.children
      return (
        <ElTableColumn
          label={column.label}
          headerAlign={column.headerAlign}
          v-slots={{ header: columnHeaderSlot(column) }}
        >
          {childrenColumn.map(column => renderColumn(column))}
        </ElTableColumn>
      )
    }

    // 渲染展开项
    const genExpand = (column) => {
      // 展开项可以使用render函数，也可以使用插槽，使用插槽需声明 slot: 'expand',
      return (
        <ElTableColumn
          label={column.label}
          type="expand"
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row, $index }) => {
              if (column.render) {
                // 渲染函数
                return column.render(row, column, $index)
              } else {
                // 通过插槽渲染展开项
                return <SlotColumn row={row} column={column} index={$index} />
              }
            },
          }}
        />
      )
    }

    // 通用格式化
    const commonformatter = (row, column) => {
      return get(row, column.property, '--')
    }

    // 通用的表格
    const genCommonColumn = (column: Column) => {
      const formatter = column.formatter || commonformatter
      const showTooltip = column.type === 'selection' ? false : column.showOverflowTooltip
      return (
        <ElTableColumn
          {...column}
          // selectable 只对仅对 type=selection 的列有效
          selectable={column.selectable}
          showOverflowTooltip={showTooltip}
          formatter={formatter}
          v-slots={{ header: columnHeaderSlot(column) }}
        />
      )
    }

    function renderColumn(column: Column) {
      if (column.render && column.type !== 'expand') {
        return genRender(column)
      } else if (column.component) {
        return getComponent(column)
      } else if (column.slot && column.type !== 'expand') {
        return genSlot(column)
      } else if (column.edit) {
        return genEditableColumn(column)
      } else if (column.children) {
        return genChildren(column)
      } else if (column.type === 'expand') {
        return genExpand(column)
      } else {
        return genCommonColumn(column)
      }
    }

    return () => renderColumn(props.column)
  },
})

export default RenderColumn
