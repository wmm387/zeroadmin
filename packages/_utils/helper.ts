import { get } from 'lodash-es'
import { getCurrentInstance } from 'vue'

export const hasOwn = (
  val: Record<string, unknown>,
  key: string | symbol,
): key is keyof typeof val => Object.prototype.hasOwnProperty.call(val, key)

// 获取vue全局属性
export const useGlobal = () => {
  const {
    appContext: {
      config: { globalProperties: properties },
    },
  } = getCurrentInstance()
  return properties
}

/**
 * 分配来源对象的可枚举属性到目标对象上。 来源对象的应用规则是从左到右，随后的下一个对象的属性会覆盖上一个对象的属性
 * 注意: 这方法会改变 object，参考自Object.assign.
 * 区别Object.assign,此方法只会分配目标对象上存在的属性
 * @param object
 * @param otherArgs
 */
export const assignHas = (object: any, ...otherArgs: any[]) => {
  otherArgs.forEach(arg => {
    for (const key in arg) {
      if (hasOwn(arg, key) && hasOwn(object, key)) {
        object[key] = arg[key]
      }
    }
  })
}

// 隐藏手机号中间4位
export const hidePhoneNumber = (number: string) => {
  if (number) {
    return number.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
}

export const option2Map = (arr: any[], labelField = 'label', valueField = 'value') => {
  const obj = {}
  arr.forEach(item => {
    if (hasOwn(item, valueField)) {
      const value = get(item, valueField)
      obj[value] = get(item, labelField)
    }
  })
  return obj
}

// 检测设备类型(手机返回true,反之)
export const deviceDetection = () => {
  const sUserAgent: { match } = navigator.userAgent.toLowerCase()
  // const bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  // eslint-disable-next-line eqeqeq
  const bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os'
  // eslint-disable-next-line eqeqeq
  const bIsMidp = sUserAgent.match(/midp/i) == 'midp'
  // eslint-disable-next-line eqeqeq
  const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4'
  // eslint-disable-next-line eqeqeq
  const bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb'
  // eslint-disable-next-line eqeqeq
  const bIsAndroid = sUserAgent.match(/android/i) == 'android'
  // eslint-disable-next-line eqeqeq
  const bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce'
  // eslint-disable-next-line eqeqeq
  const bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile'
  return (
    bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM
  )
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function float2Percent(float: number, fractionDigits = 2) {
  return `${(float * 100).toFixed(fractionDigits)}%`
}

export function trim(str: string, chars = ' ') {
  // 构造正则表达式，匹配开头和结尾的指定字符
  const pattern = new RegExp(`^[${chars}]+|[${chars}]+$`, 'g')
  // 使用 replace 方法删除匹配到的字符
  return str.replace(pattern, '')
}

// 睡眠,毫秒
export function sleep(ms) {
  return new Promise(resolve => {
    return setTimeout(resolve, ms)
  })
}

// 格式化下拉框选择项
export const formatSelectOptions = (list: Recordable[], labelField = 'name', valueField = 'id') => {
  return list.map(item => ({
    label: get(item, labelField),
    value: get(item, valueField),
  }))
}

// 根据图片地址获取图片大小
export const getImageWidthHeight: (src: string) => Promise<{ width: number, height: number }> = src => {
  return new Promise(resolve => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      })
    }
  })
}
