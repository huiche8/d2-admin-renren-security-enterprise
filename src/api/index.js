import request from '@/plugin/axios'

export const sysAccountService = {
  login (data) {
    return request({
      url: '/login',
      method: 'post',
      data
    })
  }
}
