import dayjs from 'dayjs'

export const dateUtil = dayjs

/**
 * 获取今天日期字符串
 * @param format 格式化字符串,默认YYYY-MM-DD
 * @returns {string} 今天日期字符串
 */
export function today(format = 'YYYY-MM-DD') {
  return dayjs().format(format)
}

/**
 * 获取昨天日期字符串
 * @param format 格式化字符串,默认YYYY-MM-DD
 * @returns {string} 昨天日期字符串
 */
export function yesterday(format = 'YYYY-MM-DD') {
  return dayjs().subtract(1, 'day').format(format)
}

/**
 * 获取当前时间字符串
 * @returns {string} 2024-01-01 12:00:00
 */
export const now = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 获取日期字符串
 * @param date dayjs.ConfigType
 * @param format 格式化字符串,默认YYYY-MM-DD
 * @returns {string} 日期字符串
 */
export const date = (date: dayjs.ConfigType, format = 'YYYY-MM-DD'): string => {
  return date ? dayjs(date).format(format) : '--'
}

/**
 * 获取时间字符串
 * @param date dayjs.ConfigType
 * @param format 格式化字符串,默认YYYY-MM-DD HH:mm:ss
 * @returns {string} 时间字符串
 */
export const time = (date: dayjs.ConfigType, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (date) return dayjs(date).format(format)
  return '--'
}

/**
 * 获取时间格式化字符串
 * @param time 是否需要时间
 * @returns  {string} ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59' ] || ['YYYY-MM-DD', 'YYYY-MM-DD']
 */
export const timesFormats = (time?: boolean) => {
  const format1 = time ? 'YYYY-MM-DD 00:00:00' : 'YYYY-MM-DD'
  const format2 = time ? 'YYYY-MM-DD 23:59:59' : 'YYYY-MM-DD'
  return [format1, format2]
}

/**
 * 今天日期数组
 * @param time 是否需要时间
 * @returns {string} 今天日期数组
 */
export const todays = (time?: boolean) => {
  const formats = timesFormats(time)
  return [
    dayjs().format(formats[0]),
    dayjs().format(formats[1]),
  ]
}

/**
 * 获取前7天日期数组
 * @param time 是否需要时间
 * @returns {string} ['2024-01-01 00:00:00', '2024-01-01 23:59:59' ] || ['2024-01-01', '2024-01-01']
 */
export const getBefore7Days = (time?: boolean) => {
  const formats = timesFormats(time)
  return [
    dayjs().subtract(7, 'day').format(formats[0]),
    dayjs().subtract(1, 'day').format(formats[1]),
  ]
}

/**
 * 获取近7天日期数组
 * @param time 是否需要时间
 * @returns {string} ['2024-01-01 00:00:00', '2024-01-01 23:59:59' ] || ['2024-01-01', '2024-01-01']
 */
export const getCurrent7Days = (time?: boolean) => {
  const formats = timesFormats(time)
  return [
    dayjs().subtract(6, 'day').format(formats[0]),
    dayjs().format(formats[1]),
  ]
}

/**
 * 获取周起始日
 * @param time 是否需要时间
 * @returns {string} '2024-01-01 00:00:00' || '2024-01-01'
 */
export const weekStartDay = (time?: boolean) => {
  const today = dayjs()
  let weekDay = today
  if (today.day() === 0) {
    // 今天是星期天,减去一天,变成上周(周日为周起始天)
    weekDay = today.subtract(1, 'day')
  }
  return weekDay.day(1).format(time ? 'YYYY-MM-DD 00:00:00' : 'YYYY-MM-DD')
}

/**
 * 格式化秒数
 * @param value 秒数
 * @param fractionDigits 保留小数位数
 * @returns {string} '00:00'
 */
export const formatSeconds = (value, fractionDigits?: number) => {
  let secondTime = value // 秒
  let minuteTime = 0 // 分
  if (secondTime > 60) {
    // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60)
    // 获取秒数，秒数取余，得到整数秒数
    secondTime = secondTime % 60
  }
  let secondStr = '00'
  if (secondTime > 0) {
    secondTime = parseFloat(secondTime).toFixed(fractionDigits)
    if (secondTime < 10) {
      secondStr = `0${secondTime}`
    } else {
      secondStr = `${secondTime}`
    }
  }
  let minuteStr = '00'
  if (minuteTime > 0) {
    if (minuteTime < 10) {
      minuteStr = `0${minuteTime}`
    } else {
      minuteStr = `${minuteTime}`
    }
  }
  return `${minuteStr}:${secondStr}`
}

/**
 * 获取今天零时时间戳
 * @param ms 是否返回毫秒
 * @returns {number} 今天零时时间戳
 */
export const todayUnix = (ms = false) => {
  const unix = dateUtil(today()).unix()
  return ms ? unix * 1000 : unix
}
