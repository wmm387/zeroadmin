import type { Component } from 'vue'
import { ElInput } from 'element-plus'
import { BaseSelect, NumberInput, TrueFalseSwitch } from '../../Form'
import type { TableColumnEditComponentType } from './types/component'

const componentMap = new Map<TableColumnEditComponentType, Component>()

componentMap.set('input', ElInput)
componentMap.set('textarea', ElInput)
componentMap.set('numberInput', NumberInput)
componentMap.set('select', BaseSelect)
componentMap.set('trueFalseSwitch', TrueFalseSwitch)
componentMap.set('onOffSwitch', TrueFalseSwitch)

export function add(compName: TableColumnEditComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: TableColumnEditComponentType) {
  componentMap.delete(compName)
}

export { componentMap }
