import type { Component } from 'vue'
import type { TableColumnEditComponentType } from './types/component'
import { ElInput } from 'element-plus'
import { NumberInput, Radio, Select, TrueFalseSwitch } from '../../Form'

const componentMap = new Map<TableColumnEditComponentType, Component>()

componentMap.set('input', ElInput)
componentMap.set('textarea', ElInput)
componentMap.set('numberInput', NumberInput)
componentMap.set('select', Select)
componentMap.set('trueFalseSwitch', TrueFalseSwitch)
componentMap.set('onOffSwitch', TrueFalseSwitch)
componentMap.set('radio', Radio)

export { componentMap }
