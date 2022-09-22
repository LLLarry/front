import request from '@/utils/request'

/**
 * 获取VIP在支付数据
 * @param {*} data
 * @returns
 */
export const getVipPayList = (data) => {
  return request({
    url: '/user/vip/pay/list',
    data
  })
}
