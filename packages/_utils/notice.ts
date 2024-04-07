import { ElMessage, ElMessageBox } from 'element-plus'
import { isObject } from './is'
import { hasOwn } from './helper'

function extractProps(obj, ...props) {
  return props.map(key => {
    if (hasOwn(obj, key)) {
      const value = obj[key]
      delete obj[key]
      return value
    } else {
      return null
    }
  })
}

type ElMessageReturnType = ReturnType<typeof ElMessage>

interface ToastMessage {
  (message: string, options?): ElMessageReturnType
  success: (message?: string, options?) => ElMessageReturnType
  error: (message?: string, options?) => ElMessageReturnType
  warning: (message: string, options?) => ElMessageReturnType
  info: (message: string, options?) => ElMessageReturnType
}

/**
 * toast
 * message, ...
 */

export const toast = ((message: string, options = {}) => {
  if (!isObject(options)) options = {}
  return ElMessage({
    duration: 2000,
    ...options,
    message,
  })
}) as ToastMessage

['success', 'warning', 'info', 'error'].forEach(key => {
  const defaultMessage = key === 'success' ? '操作成功' : key === 'error' ? '操作失败' : ''
  toast[key] = (message = defaultMessage, options = {}) => toast(message, { ...options, type: key })
})

/**
 * alert
 * @param {string} message
 * @param {object} options
 * @param options.title
 * @param options.icon
 * @param options.showCancelButton
 * @param options.showConfirmButton
 * @param options.showClose
 * @param options.desc
 * @param options.warning
 * @param options.extra
 */
export function alert(message: string, options = {}) {
  if (!isObject(options)) options = {}
  const [title, icon, desc, warning, extra] = extractProps(
    options,
    'title',
    'icon',
    'desc',
    'warning',
    'extra',
  )
  return ElMessageBox.alert(
    `<div class="g-tip-dialog-container">
            ${icon ? `<div class="icon ${icon}"></div>` : ''}
            <p class="primary">${message}</p>
            ${desc ? `<p class="info">${desc}</p>` : ''}
            ${warning ? `<p class="warning-info">${warning}</p>` : ''}
            ${extra || ''}
        </div>`,
    title || '提示',
    {
      confirmButtonText: '确认',
      ...options,
      dangerouslyUseHTMLString: true,
    } as any,
  )
}

/**
 * confirm
 * @param message
 * @param options {Object}
 * @param options.title
 * @param options.icon
 * @param options.showCancelButton
 * @param options.showConfirmButton
 * @param options.showClose
 * @param options.desc
 * @param options.warning
 * @param options.extra
 */
export function confirm(message: string, options = {}) {
  if (!isObject(options)) options = {}
  const [title, icon, desc, warning, info, extra] = extractProps(
    options,
    'title',
    'icon',
    'desc',
    'warning',
    'info',
    'extra',
  )
  return ElMessageBox.confirm(
    `<div class="g-tip-dialog-container">
            ${icon ? `<div class="icon ${icon}"></div>` : ''}
            <p class="primary">${message}</p>
            ${desc ? `<p class="info">${desc}</p>` : ''}
            ${warning ? `<p class="warning-info">${warning}</p>` : ''}
            ${info ? `<p class="sub-info">${info}</p>` : ''}
            ${extra || ''}
        </div>`,
    title || '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      closeOnPressEscape: false,
      ...options,
      dangerouslyUseHTMLString: true,
    } as any,
  )
}

// 关闭所有alert，confirm
export const closeAllMessageBox = ElMessageBox.close
