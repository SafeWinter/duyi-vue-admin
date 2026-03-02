import request from '@/utils/request'

export function delComment(id) {
  return request.delete(`/api/comment/${id}`)
}

export function getPagedComments(page = 1, limit = 10, blogid = -1, keyword = '') {
  return request({
    url: `/api/comment`,
    method: 'get',
    params: {
      page, limit, blogid, keyword
    }
  })
}
