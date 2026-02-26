import request from '@/utils/request'

export function fetchBanner() {
  return request({
    url: '/api/banner',
    method: 'get'
  })
}

export function postBanner(banners) {
  return request({
    url: '/api/banner',
    method: 'post',
    data: banners
  })
}
