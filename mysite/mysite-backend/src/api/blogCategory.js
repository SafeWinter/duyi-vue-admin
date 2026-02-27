import request from '@/utils/request'

export function addCategory({ name, order }) { // {name: 'xxx', order: 2}
  return request({
    url: '/api/blogtype',
    method: 'post',
    data: {
      name,
      order
    }
  })
}

export function delCategory(id) {
  return request({
    method: 'delete',
    url: `/api/blogtype/${id}`
  })
}

export function updateCategory({ id, data }) { // {name: 'xxx', order: 2}
  return request({
    method: 'put',
    url: `/api/blogtype/${id}`,
    data
  })
}

export function getBlogCategories() {
  return request.get('/api/blogtype')
}

export function getBlogCategory(id) {
  return request.get(`/api/blogtype/${id}`)
}

