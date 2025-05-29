import type { ComputedRef } from 'vue'
import type { ActionBtn, ActionBtnPopconfirm, TablePropsType } from '../types'
import { isArray, isBoolean, isDef, isEmpty, isUnDef, toast } from '@pkg/utils'
import { assign } from 'lodash-es'
import { computed, unref } from 'vue'

export function useAction(propsRef: ComputedRef<TablePropsType>) {
  const defaultHeaderData: ActionBtn = { size: 'default', color: 'primary', position: 'table-header' }
  const defaultColumnData: ActionBtn = { size: 'default', color: 'primary', btnType: 'link', position: 'table-column' }

  const defaultPopconfirmData: Partial<ActionBtnPopconfirm> = { okText: '确定', cancelText: '取消', width: 200 }

  const defaultAddData: ActionBtn = { text: '新增', color: 'primary', position: 'table-header' }
  const defaultEditData: ActionBtn = { text: '编辑', color: 'primary', position: 'table-column' }
  const defaultDeleteData: ActionBtn = { text: '删除', color: 'danger', position: 'table-column', popconfirm: { title: '确认删除此条数据?' } }

  const defaultDeleteHandle = (act: ActionBtn) => {
    if (act.api) {
      act.handle = async (row: any) => {
        if (!row.id) return
        await act.api(row.id)
        toast.success('删除成功')
      }
      act.isAsync = true
    }
  }

  const handleSpecial = (action: ActionBtn) => {
    switch (action.special) {
      case 'add':
      case 'create':
        return assign({}, defaultAddData, action)
      case 'edit':
      case 'update':
        return assign({}, defaultEditData, action)
      case 'delete':
        defaultDeleteHandle(action)
        return assign({}, defaultDeleteData, action)
    }
  }

  const handlePosition = (action: ActionBtn) => {
    switch (action.position) {
      case 'table-header':
        return assign({}, defaultHeaderData, action)
      case 'table-column':
        return assign({}, defaultColumnData, action)
      default:
        return assign({}, defaultColumnData, action)
    }
  }

  const getActions = computed(() => {
    const { actions, hasAuth } = unref(propsRef.value.options)
    if (!actions) {
      return []
    }
    return actions.filter((action) => {
      const show = isUnDef(action.show) ? true : isBoolean(action.show) ? action.show : true
      const auth = (isDef(hasAuth) && !isEmpty(action.auth)) ? hasAuth([...action.auth]) : true
      return auth && show
    }).map(action => {
      if (action.special) {
        action = handleSpecial(action)
      }
      if (action.popconfirm) {
        const info = isBoolean(action.popconfirm) ? { title: `确认${action.text}此条数据?` } : action.popconfirm
        action = assign({}, action, { popconfirm: assign({}, defaultPopconfirmData, info) })
      }
      return handlePosition(action)
    })
  })

  const getHeaderActions = computed(() => {
    return getActions.value.filter(act => act.position === 'table-header')
  })

  const getColumnActions = computed(() => {
    return getActions.value.filter(act => act.position === 'table-column')
  })

  return {
    getHeaderActions,
    getColumnActions,
  }
}
