import _ from 'lodash'
import CryptoJS from 'crypto-js'
import type { RunAtMoment } from '@/types'
import { ts } from '@/utils/luxon/index'
import { useBiliStore } from '@/stores/useBiliStore'

/**
 * 生成一个 version 4 uuid
 * @returns uuid
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const randomInt = (16 * Math.random()) | 0
    return ('x' === char ? randomInt : (3 & randomInt) | 8).toString(16)
  })
}

/**
 * 从 URL 中获取文件名
 * @param url
 */
export function getFilenameFromUrl(url: string): string {
  return url.substring(url.lastIndexOf('/') + 1).split('.')[0]
}

/**
 * 为 URL 添加查询参数
 * @param url URL
 * @param params 查询参数
 */
export function addURLParams(url: string, params?: Record<string, any> | string): string {
  if (!params) {
    return url
  }

  if (typeof params === 'string') {
    return url + '?' + params
  } else {
    return url + '?' + new URLSearchParams(params).toString()
  }
}

/**
 * 对请求参数进行 wbi 签名
 * @param params 请求参数
 */
export function wbiSign(params: Record<string, string | number | object>): string {
  // 添加 wts 字段（当前秒级时间戳）
  params.wts = ts()
  // 按照键对参数进行排序
  const query = Object.keys(params)
    .sort()
    .map((key) => {
      // 过滤 value 中的 !'()* 字符
      const value = params[key].toString().replace(/[!'()*]/g, '')
      // 注：空格需被编码为%20而不是+，因此不能使用URLSearchParams
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')
  // 计算 w_rid
  const wbiSign = CryptoJS.MD5(query + useBiliStore().wbiSalt).toString()

  return query + '&w_rid=' + wbiSign
}

/**
 * 把一个普通对象打包为 FormData
 * @param json 一个不包含嵌套对象的对象
 * @returns FormData
 */
export function packFormData(json: Record<string, any>): FormData {
  const formData = new FormData()
  _.forEach(json, (value, key) => formData.append(key, value.toString()))
  return formData
}

/**
 * 遍历一个对象最深层的属性
 * @param obj 要遍历的对象
 * @param fn 回调函数，参数是最深层属性的值和当前路径
 * @param path 遍历对象的路径，默认从最外层开始遍历
 */
export function deepestIterate(obj: any, fn: (value: any, path: string) => void, path?: string) {
  _.forOwn(obj, function (value, key) {
    const newPath = path ? path + '.' + key : key
    if (_.isPlainObject(value) && !_.isEmpty(value)) {
      deepestIterate(value, fn, newPath)
    } else {
      fn(value, newPath)
    }
  })
}

/**
 * 从 fetch 的 input 参数中获取 URL
 * @param input fetch 的第一个参数
 * @returns URL
 */
export function getUrlFromFetchInput(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input
  } else if (input instanceof URL) {
    return input.toString()
  } else if (input instanceof Request) {
    return input.url
  } else {
    return 'Incorrect input'
  }
}

/**
 * 等待直到指定时刻
 * @param moment 运行时机
 */
export function waitForMoment(moment: RunAtMoment): Promise<void> {
  switch (moment) {
    case 'document-start': {
      // 在 document-start 阶段，document-head 可能为 null
      return Promise.resolve()
    }
    case 'document-head': {
      // 在 document-head 阶段，document.head 已经出现但是部分内部节点可能还没出现
      return new Promise((resolve) => {
        if (document.head) {
          resolve()
        } else {
          const observer = new MutationObserver(() => {
            if (document.head) {
              observer.disconnect()
              resolve()
            }
          })
          observer.observe(document.documentElement, { childList: true })
        }
      })
    }
    case 'document-body': {
      // 在 document-body 阶段，document.body 已经出现但是部分内部节点可能还没出现
      return new Promise((resolve) => {
        if (document.body) {
          resolve()
        } else {
          const observer = new MutationObserver(() => {
            console.log('document-body')
            if (document.body) {
              observer.disconnect()
              resolve()
            }
          })
          observer.observe(document.documentElement, { childList: true })
        }
      })
    }
    case 'document-end': {
      // 在 document-end 阶段，DOM 加载完成，但部分资源可能还没获取到（比如图片）
      return new Promise((resolve) => {
        if (document.readyState !== 'loading') {
          resolve()
        } else {
          document.addEventListener('DOMContentLoaded', () => resolve())
        }
      })
    }
    case 'window-load': {
      // 在 window-load 阶段，整个网页加载完毕
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve()
        } else {
          window.addEventListener('load', () => resolve())
        }
      })
    }
    default: {
      return Promise.reject('Illegal moment')
    }
  }
}

/**
 * 将数组转换为 Map（key 为数组元素，value 为元素下标）
 * @param arr 数组
 */
export function arrayToMap<T>(arr: T[]): Map<T, number> {
  return new Map(arr.map((value, index) => [value, index]))
}

/**
 * 获取指定名称的Cookie值
 * @param {string} name - 要查找的Cookie名称
 * @returns {string} 返回找到的Cookie值，如果未找到则返回空字符串
 */
export function getCookie(name: string): string {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      let end = document.cookie.indexOf(';', start)
      if (end === -1) end = document.cookie.length
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

/**
 * 设置Cookie
 * @param {string} name - Cookie名称
 * @param {string} value - Cookie值
 * @param {number} days - 过期天数
 */
export function setCookie(name: string, value: string, days?: number): void {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + value + expires + '; path=/'
}

/**
 * 清除Cookie
 * @param {string} name - 要清除的Cookie名称
 */
export function clearCookie(name: string): void {
  setCookie(name, '', -1)
}

/**
 * 延迟执行
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 解析B站视频URL中的视频ID
 * @param {string} url - 视频URL
 * @returns {{ aid?: string; bvid?: string } | null} 返回视频ID对象或null
 */
export function parseVideoId(url: string): { aid?: string; bvid?: string } | null {
  const avMatch = url.match(/av(\d+)/i)
  if (avMatch) {
    return { aid: avMatch[1] }
  }

  const bvMatch = url.match(/BV([a-zA-Z0-9]+)/)
  if (bvMatch) {
    return { bvid: bvMatch[1] }
  }
  console.log(url)
  return null
}

/**
 * 数组内随机取一条
 */
export function randomOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
