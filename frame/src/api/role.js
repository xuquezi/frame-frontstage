import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/role/page',
    method: 'get',
    params: query
  })
}

