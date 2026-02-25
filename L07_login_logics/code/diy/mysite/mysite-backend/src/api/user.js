import request from '@/utils/request'

export function userLogin(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/setting',
    method: 'get',
    params: { token }
  })
}

export function userLogout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
