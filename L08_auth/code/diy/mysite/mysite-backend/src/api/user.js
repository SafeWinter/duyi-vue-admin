import request from '@/utils/request'

export function userLogin(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/admin/whoami',
    method: 'get',
  })
}

export function userLogout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
