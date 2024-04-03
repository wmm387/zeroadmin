import { trim } from 'lodash-es'
import type { FormItemRule } from 'element-plus'
import { isDef, isNumber } from './is'

const isRequired = (label?: string) => {
  return { required: true, message: `${label ?? ''}必填` }
}

// 必填不包含空格
const isRequiredNoWP = () => {
  return { required: true, whitespace: true, message: '必填' }
}

const isPhone = (required = true) => {
  return {
    required,
    validator: (rule: any, value: any, callback: any) => {
      const regexp = /^1+\d{10}$/
      if (required && value === '') callback('必填')
      if (value && !regexp.test(value)) {
        return callback(new Error('请输入正确的手机号码'))
      } else {
        return callback()
      }
    },
  }
}

const isEmail = (): FormItemRule => {
  return { type: 'email', message: '请输入正确的邮箱格式' }
}

const isUrl = (required?: boolean): FormItemRule => {
  return { required, type: 'url', message: '请输入正确的链接格式' }
}

const limitString = (min: number, max: number) => {
  return { min, max, message: `介于${min}-${max}个字符之间` }
}

const limitNumber = ({ required = false, min, max, minE, maxE }: {
  required?: boolean // 必填
  min?: number // 小于
  max?: number // 大于
  minE?: number // 小于等于
  maxE?: number // 大于等于
}) => {
  return {
    required,
    validator: (rule: any, value: any, callback: any) => {
      if (required && trim(value) === '') {
        return callback(new Error('必填'))
      }
      value = Number(value)
      if (!isNumber(value)) {
        return callback(new Error('请输入数字'))
      } else if (isDef(min) && value <= min) {
        return callback(new Error(`请输入大于${min}的数字`))
      } else if (isDef(max) && value >= max) {
        return callback(new Error(`请输入小于${max}的数字`))
      } else if (isDef(minE) && value < minE) {
        return callback(new Error(`请输入大于等于${minE}的数字`))
      } else if (isDef(maxE) && value > maxE) {
        return callback(new Error(`请输入小于等于${maxE}的数字`))
      } else {
        return callback()
      }
    },
  }
}

const isPositiveInt = (required = false) => {
  return { required, pattern: /^[+]{0,1}([1-9]\d*)$/g, message: '请输入正整数' }
}

const isPositiveIntWithZero = (required = false) => {
  return { required, pattern: /^[+]{0,1}(\d+)$/g, message: '请输入0或者正整数' }
}

const isWangEditorRequired = () => {
  return {
    required: true,
    validator: (rule: any, value: any, callback: any) => {
      value = value
        .replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
        .replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
        .replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
        .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
        .trim()
      if (value === '') {
        return callback(new Error('必填'))
      } else {
        return callback()
      }
    },
  }
}

export const ElRule = {
  isRequired,
  isRequiredNoWP,
  isPhone,
  isEmail,
  isUrl,
  limitString,
  limitNumber,
  isPositiveInt,
  isPositiveIntWithZero,
  isWangEditorRequired,
}
