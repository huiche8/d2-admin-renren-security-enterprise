import request from '@/plugin/axios'

/**
 * @description [ sys ] 登陆注销相关
 */
export const sysAccountService = {
  login (data) {
    return request({
      url: '/login',
      method: 'post',
      data
    })
  }
}

/**
 * @description [ sys ] 菜单和路由相关
 */
export const sysMenuService = {
  getNav (data) {
    return request({
      url: '/sys/menu/nav',
      method: 'get',
      data
    })
  }
}
