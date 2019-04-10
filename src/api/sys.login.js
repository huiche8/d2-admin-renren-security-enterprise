import request from '@/plugin/axios'

export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
