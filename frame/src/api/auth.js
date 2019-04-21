import request from '@/utils/request'

export function getAuths() {
  return request({
    url: '/auth/list',
    method: 'get'
  })
}
