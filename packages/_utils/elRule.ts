import type { FormItemRule } from 'element-plus'
import { trim } from 'lodash-es'
import { isDef, isNumber } from './is'

/**
 * 是否必填
 * @param label 字段名
 * @returns {FormItemRule} FormItemRule
 */
const isRequired = (label?: string): FormItemRule => {
  return { required: true, message: `${label ?? ''}必填` }
}

/**
 * 必填不包含空格
 * @returns {FormItemRule} FormItemRule
 */
const isRequiredNoWP = (): FormItemRule => {
  return { required: true, whitespace: true, message: '必填' }
}

/**
 * 验证手机号码
 * @param required 是否必填,默认true
 * @returns {FormItemRule} FormItemRule
 */
const isPhone = (required = true): FormItemRule => {
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

/**
 * 验证邮件
 * @param required 是否必填,默认false
 * @returns {FormItemRule} FormItemRule
 */
const isEmail = (required = false): FormItemRule => {
  return { required, type: 'email', message: '请输入正确的邮箱格式' }
}

/**
 * 验证URL
 * @param required 是否必填,默认false
 * @returns {FormItemRule} FormItemRule
 */
const isUrl = (required = false): FormItemRule => {
  return { required, type: 'url', message: '请输入正确的链接格式' }
}

/**
 * 限制字符串长度
 * @param min 最小长度(包含)
 * @param max 最大长度(包含)
 * @returns {FormItemRule} FormItemRule
 */
const limitString = (min: number, max: number): FormItemRule => {
  return { min, max, message: `介于${min}-${max}个字符之间` }
}

/**
 * 限制数字范围
 * @param {object} options
 * @param {boolean} options.required 是否必填
 * @param {number} options.min 小于
 * @param {number} options.max 大于
 * @param {number} options.minE 小于等于
 * @param {number} options.maxE 大于等于
 * @returns {FormItemRule} FormItemRule
 */
const limitNumber = ({ required = false, min, max, minE, maxE }: { required?: boolean, min?: number, max?: number, minE?: number, maxE?: number }): FormItemRule => {
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

/**
 * 验证正整数
 * @param required 是否必填,默认false
 * @returns {FormItemRule} FormItemRule
 */
const isPositiveInt = (required = false): FormItemRule => {
  return { required, pattern: /^\+?([1-9]\d*)$/g, message: '请输入正整数' }
}

/**
 * 验证包含0的正整数
 * @param required 是否必填,默认false
 * @returns {FormItemRule} FormItemRule
 */
const isPositiveIntWithZero = (required = false): FormItemRule => {
  return { required, pattern: /^\+?(\d+)$/g, message: '请输入0或者正整数' }
}

/**
 * 验证wangEditor富文本编辑器是否必填
 * @returns {FormItemRule} FormItemRule
 */
const isWangEditorRequired = (): FormItemRule => {
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
