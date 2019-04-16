import Cookie from 'js-cookie'

/**
 * @description 存储 cookie 值
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} setting cookie setting
 */
export const cookieSet = function (name = 'default', value = '', cookieSetting = {}) {
  let currentCookieSetting = {
    expires: 1
  }
  Object.assign(currentCookieSetting, cookieSetting)
  Cookie.set(`d2admin-${process.env.VUE_APP_VERSION}-${name}`, value, currentCookieSetting)
}

/**
 * @description 拿到 cookie 值
 * @param {String} name cookie name
 */
export const cookieGet = function (name = 'default') {
  return Cookie.get(`d2admin-${process.env.VUE_APP_VERSION}-${name}`)
}

/**
 * @description 拿到 cookie 全部的值
 */
export const cookieGetAll = function () {
  return Cookie.get()
}

/**
 * @description 删除 cookie
 * @param {String} name cookie name
 */
export const cookieRemove = function (name = 'default') {
  return Cookie.remove(`d2admin-${process.env.VUE_APP_VERSION}-${name}`)
}
