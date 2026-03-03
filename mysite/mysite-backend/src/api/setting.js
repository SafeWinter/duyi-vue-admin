import request from '@/utils/request'

export function editSetting(data) {
  return request({
    url: `/api/setting`,
    method: 'put',
    data
  })
}

export function getSetting() {
  return request.get(`/api/setting`)
}
