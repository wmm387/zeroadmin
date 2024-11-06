const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

/** 是否定义 */
export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

/** 是否未定义 */
export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

/** 是否为对象 */
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

/** 是否为空 */
export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

/** 是否是日期类型 */
export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

/** 是否是null */
export function isNull(val: unknown): val is null {
  return val === null
}

/** 验证null且未定义 */
export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

/** 验证null或未定义 */
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

/** 验证定义且不是null */
export function isDefAndNotNull<T = unknown>(val: T): val is NonNullable<T> {
  return isDef(val) && !isNull(val)
}

/** 验证定义且不为空 */
export function isDefAndNotEmpty<T = unknown>(val: T): val is NonNullable<T> {
  return isDef(val) && !isEmpty(val)
}
/** 验证是否有效值 */
export function isPayload(val: unknown) {
  return isDef(val) && !isNull(val) && !isEmpty(val)
}

/** 是否是数字类型 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

/** 是否是Promise类型 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return (
    is(val, 'Promise')
    && isObject(val)
    && isFunction(val.then)
    && isFunction(val.catch)
  )
}

/** 是否是异步函数 */
export function isAsyncFn(fn: unknown): boolean {
  const AsyncFunction = (async () => {}).constructor
  return fn instanceof AsyncFunction
}

/** 是否是字符串 */
export function isString(val: unknown): val is string {
  return is(val, 'String')
}

/** 是否是方法 */
// eslint-disable-next-line ts/no-unsafe-function-type
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

/** 是否是布尔类型 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

/** 是否是 正则类型 */
export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

/** 是否是数组类型 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

/** 是否是window */
export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

/** 是否是Element */
export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName
}

/** 是否是服务端 */
export const isServer = typeof window === 'undefined'

/** 是否是客户端 */
export const isClient = !isServer

/** url链接正则 */
export function isUrl(value: string): boolean {
  const reg = /^(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d+)?(?:\/\S*)?$/
  return reg.test(value)
}

/** 手机号码正则 */
export function isPhone(value: string): boolean {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(value)
}

/** 邮箱正则 */
export function isEmail(value: string): boolean {
  const reg = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  return reg.test(value)
}

/** 是否生产环境 */
export function isProdMode(): boolean {
  return import.meta.env.PROD
}
