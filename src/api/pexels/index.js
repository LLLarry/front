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

/**
 * 获取主题
 */
export const getThemes = (data) => {
  return request({
    url: '/pexels/themes',
    params: data
  })
}

/**
 * pins详情
 */
 export const getPinsById = (data) => {
  return request({
    url: '/pexels/' + data.id
  })
}
