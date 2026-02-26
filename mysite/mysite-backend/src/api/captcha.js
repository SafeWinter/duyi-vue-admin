import * as req from '@/utils/request'
const { request } = req.default

export function getCaptcha() {
  return request({
    url: '/res/captcha',
    method: 'get'
  })
}
