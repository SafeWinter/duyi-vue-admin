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

export function addBlog(data) {
  return request({
    url: '/api/blog',
    method: 'post',
    data
  })
}

export function editBlog(data) {
  return request({
    url: `/api/blog/${data.id}`,
    method: 'put',
    data
  })
}

export function getBlogDetail(id) {
  return request.get(`/api/blog/${id}`)
}
