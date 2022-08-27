import request from '@/utils/request'

export const getPexels = (data) => {
  return request({
    url: '/pexels/list',
    params: data
  })
}
