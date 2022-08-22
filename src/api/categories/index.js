import request from '@/utils/request'

export const getCategories = () => {
  return request({
    url: 'category'
  })
}
