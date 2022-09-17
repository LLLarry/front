import request from '@/utils/request'
import md5 from 'md5'

/**
 * 人类行为认证
 * @param {*} data
 * @returns
 */
export const getCaptcha = (data) => {
  return request({
    url: '/sys/captcha',
    method: 'POST',
    data
  })
}
/**
 * 获取token信息 当有password时，进行md5加密
 * @param {*} data
 * @returns
 */
export const getToken = (data) => {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

/**
 * 获取用户信息
 * @param {*} data
 * @returns
 */
export const getProfile = (data) => {
  return request({
    url: '/user/profile',
    method: 'GET',
    data
  })
}

/**
 * 注册用户
 * @param {*} data
 * @returns
 */
export const registerUser = (data) => {
  return request({
    url: '/sys/register',
    method: 'post',
    data
  })
}

/**
 * 修改用户信息
 * @param {*} data
 * @returns
 */
export const putUser = (data) => {
  return request({
    url: '/user/profile',
    method: 'put',
    data
  })
}

/**
 * 获取阿里云oss配置信息
 * @param {*} data
 * @returns
 */
export const getSts = (data) => {
  return request({
    url: '/user/sts',
    method: 'get',
    data
  })
}
