import request from '@/utils/request'

export function fetchBanner() {
  return request({
    url: '/api/banner',
    method: 'get'
  })
}