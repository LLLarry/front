import request from '@/utils/request'

export const getPexels = (data) => {
  return request({
    url: '/pexels/list',
    params: data
  })
}
/**
 * 获取搜索提示
 */
export const getPexelsHint = (data) => {
  return request({
    url: '/pexels/hint',
    params: data
  })
}
