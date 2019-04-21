import request from '@/utils/request'

export function fetchLoginLogList(query) {
  return request({
    url: '/log/login/page',
    method: 'get',
    params: query
  })
}

export function fetchLogoutLogList(query) {
  return request({
    url: '/log/logout/page',
    method: 'get',
    params: query
  })
}
