import request from '@/utils/request'

export function delMessage(id) {
  return request.delete(`/api/message/${id}`)
}

export function addMessage(data) {
  return request({
    url: `/api/message`,
    method: 'post',
    data
  })
}

export function getPagedMessages(page = 1, limit = 10, keyword = '') {
  return request({
    url: `/api/message`,
    method: 'get',
    params: {
      page, limit, keyword
    }
  })
}
