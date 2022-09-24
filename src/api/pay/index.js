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

/**
 * 支付宝下单
| subject     | 支付标题         |              |
| ----------- | ---------------- | ------------ |
| totalAmount | 支付价格         | 默认为 0.01  |
| body        | 支付描述         |              |
| isMobile    | 是否为移动端请求 | 默认为 false |
 * @returns
 */
export const alipay = (subject, totalAmount, body, isMobile) => {
  return request({
    url: '/user/alipay',
    data: { subject, totalAmount, body, isMobile }
  })
}

/**
 * 支付宝结果
 * out_trade_no 订单号
 * @returns
 */
export const alipayResult = (out_trade_no) => {
  return request({
    url: '/user/alipay',
    data: { out_trade_no }
  })
}
