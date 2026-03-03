import request from '@/utils/request'

export function editAbout(data) {
  return request({
    url: `/api/about`,
    method: 'post',
    data
  })
}

export function getAbout() {
  return request.get(`/api/about`)
}
