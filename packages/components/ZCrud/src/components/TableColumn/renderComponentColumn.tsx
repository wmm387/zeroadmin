import type { Column } from '../../types/column'
import { CopyText, TextColumn, TimeColumn } from '@pkg/components'
import { isArray, isEmpty, isNullOrUnDef, time } from '@pkg/utils'
import { ElButton, ElImage, ElProgress, ElTableColumn, ElTag } from 'element-plus'
import { get } from 'lodash-es'
import { defineComponent, type PropType } from 'vue'
import columnHeaderSlot from './slotHeader'

const RenderComponentColumn = defineComponent({
  name: 'RenderComponentColumn',
  props: {
    column: {
      type: Object as PropType<Column>,
      default: () => { },
    },
  },
  setup(props) {
    const formatter = (row, column: Column) => {
      return column.formatter || get(row, column.prop, '--')
    }

    // 图片
    const genImageColumn = (column: Column) => {
      return (
        <ElTableColumn
          {...column}
          showOverflowTooltip={false}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row }) => {
              const img = get(row, column.prop)
              const imageList = isArray(img) ? img : [img]
              return (
                isNullOrUnDef(img) || isEmpty(img)
                  ? <span class="text-info">暂无图片</span>
                  : (
                      <ElImage
                        class="table-image"
                        src={imageList[0]}
                        preview-src-list={imageList}
                        preview-teleported={true}
                        fit="contain"
                      />
                    )
              )
            },
          }}
        />
      )
    }

    // 单标签
    const genTagColumn = (column: Column) => {
      return (
        <ElTableColumn
          {...column}
          showOverflowTooltip={false}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row }) => {
              const value = formatter(row, column)
              let tag = { type: 'info', label: value }
              if (column.componentAttr?.tagMap) {
                tag = column.componentAttr.tagMap[value]
              }
              if (column.componentAttr?.getTag) {
                tag = column.componentAttr.getTag(row)
              }
              return (
                <ElTag class="table-tag" type={tag?.type}>
                  {tag?.label}
                </ElTag>
              )
            },
          }}
        />
      )
    }

    // 多标签
    const genTagsColumn = (column: Column) => {
      return (
        <ElTableColumn
          {...column}
          showOverflowTooltip={false}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row }) => {
              const tags = get(row, column.prop)
              return (
                tags?.map((tag: string) => (
                  <ElTag class="table-tag">
                    {get(tag, column.componentAttr.tagName)}
                  </ElTag>
                ))
              )
            },
          }}
        />
      )
    }

    const genYesOrNoTagColumn = (column: Column, onOrOff?: boolean) => {
      return (
        <ElTableColumn
          {...column}
          showOverflowTooltip={false}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row }) => {
              const flag = !!get(row, column.prop)
              return (
                <>
                  {
                    flag
                      ? (<ElTag type="success">{onOrOff ? '开' : '是'}</ElTag>)
                      : (<ElTag type="info">{onOrOff ? '关' : '否'}</ElTag>)
                  }
                </>
              )
            },
          }}
        />
      )
    }

    const genTimesColumn = (column: Column) => {
      return (
        <ElTableColumn
          {...column}
          showOverflowTooltip={false}
          width={180}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row }) => (
              <div class="text-xs">
                <TextColumn label="创建" value={time(row.created_at)} />
                <TextColumn label="更新" value={time(row.updated_at)} />
              </div>
            ),
          }}
        />
      )
    }

    const genCopyTextColumn = (column: Column) => {
      return (
        <ElTableColumn
          {...column}
          showOverflowTooltip={false}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row }) => (
              <CopyText content={get(row, column.prop)} />
            ),
          }}
        />
      )
    }

    const genTextColumn = (column: Column) => {
      return (
        <ElTableColumn
          {...column}
          showOverflowTooltip={false}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row }) => (
              <div class={column.componentAttr?.class}>
                {
                  column.componentAttr?.list.map(item => {
                    const value = item?.valueFormatter ? item?.valueFormatter(row) : get(row, item?.valueKey)
                    return (
                      <TextColumn
                        label={item?.label}
                        value={value || '--'}
                        copied={item?.copied}
                      />
                    )
                  })
                }
              </div>
            ),
          }}
        />
      )
    }

    const genTimeColumn = (column: Column, type = 'time') => {
      return (
        <ElTableColumn
          {...column}
          showOverflowTooltip={false}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row }) => (
              <TimeColumn timeStr={get(row, column.prop)} type={type} />
            ),
          }}
        />
      )
    }

    const progressColor = (percentage: number | string): string => {
      percentage = Number(percentage)
      if (percentage < 30) {
        return '#909399'
      }
      if (percentage < 70) {
        return '#e6a23c'
      }
      return '#67c23a'
    }

    const genProgressColumn = (column: Column) => {
      return (
        <ElTableColumn
          {...column}
          showOverflowTooltip={false}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row }) => (
              <ElProgress
                percentage={get(row, column.prop)}
                color={progressColor}
                strokeWidth={8}
              />
            ),
          }}
        />
      )
    }

    const genButtonColumn = (column: Column) => {
      return (
        <ElTableColumn
          {...column}
          showOverflowTooltip={false}
          v-slots={{
            header: columnHeaderSlot(column),
            default: ({ row, $index }) => (
              <ElButton
                type="primary"
                onclick={() => column.click(row, $index)}
                {...column.componentAttr}
              >
                {formatter(row, column)}
              </ElButton>
            ),
          }}
        />
      )
    }

    const renderColumn = (column: Column) => {
      switch (column.component) {
        case 'image':
        case 'img':
          return genImageColumn(column)
        case 'tag':
          return genTagColumn(column)
        case 'tags':
          return genTagsColumn(column)
        case 'yesOrNoTag':
          return genYesOrNoTagColumn(column)
        case 'onOrOffTag':
          return genYesOrNoTagColumn(column, true)
        case 'times':
          return genTimesColumn(column)
        case 'copyText':
        case 'copy':
          return genCopyTextColumn(column)
        case 'textColumn':
          return genTextColumn(column)
        case 'timeColumn':
        case 'time':
          return genTimeColumn(column)
        case 'date':
          return genTimeColumn(column, 'date')
        case 'progress':
          return genProgressColumn(column)
        case 'button':
        case 'btn':
          return genButtonColumn(column)
      }
    }

    return () => renderColumn(props.column)
  },
})

export default RenderComponentColumn
