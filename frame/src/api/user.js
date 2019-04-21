import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/page',
    method: 'get',
    params: query
  })
}

export function stopAndUse(data) {
  return request({
    url: '/user/stopAndUse',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

