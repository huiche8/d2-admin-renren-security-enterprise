import axios from 'axios'
import { cookieGet } from '@/common/cookie'
import { Message } from 'element-ui'
import { isPlainObject } from 'lodash'
import qs from 'qs'
import store from '@/store'

// 记录和显示错误
function errorLog (info) {
  // 显示提示
  Message({
    message: info,
    type: 'error',
    duration: 5 * 1000
  })
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 1000 * 180,
  withCredentials: true
})

/**
 * 请求拦截
 */
service.interceptors.request.use(config => {
  config.headers['Accept-Language'] = cookieGet('language') || 'zh-CN'
  config.headers['token'] = cookieGet('token') || ''
  // 默认参数
  var defaults = {}
  // 防止缓存，GET请求默认带_t参数
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      ...{ '_t': new Date().getTime() }
    }
  }
  if (isPlainObject(config.params)) {
    config.params = {
      ...defaults,
      ...config.params
    }
  }
  if (isPlainObject(config.data)) {
    config.data = {
      ...defaults,
      ...config.data
    }
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      config.data = qs.stringify(config.data)
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
service.interceptors.response.use(response => {
  if (response.data.code === 401 || response.data.code === 10001) {
    store.dispatch('d2admin/account/logout')
    return Promise.reject(response.data.msg)
  } else if (response.data.code !== 0) {
    errorLog(response.data.msg)
    return Promise.reject(response.data.msg)
  } else {
    return response.data.data
  }
}, error => {
  errorLog(error.message)
  return Promise.reject(error)
})

export default service
