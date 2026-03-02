import request from '@/utils/request'

export function delProject(id) {
  return request({
    url: `/api/project/${id}`,
    method: 'delete'
  })
}

export function addProject(data) {
  return request({
    url: '/api/project',
    method: 'post',
    data
  })
}

export function editProject(data) {
  return request({
    url: `/api/project/${data.id}`,
    method: 'put',
    data
  })
}

export function getProjects() {
  return request.get(`/api/project`)
}
