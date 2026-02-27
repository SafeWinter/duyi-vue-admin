import request from '@/utils/request'

export function getList(page = 1, limit = 10, categoryid = -1) {
  return request({
    url: '/api/blog',
    method: 'get',
    params: {
      page, limit, categoryid
    }
  })
}

export function deleteArticle(id) {
  return request({
    method: 'delete',
    url: `/api/blog/${id}`
  })
}
