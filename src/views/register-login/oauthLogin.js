import store from '@/store'
import router from '@/router'
import { OAUTH_LOGIN_NO_REGISTER_CODE } from '@/constants'
/**
 * @param loginType 登录类型 QQ、WX
 * @param data 登录时需要传递的数据
 */
export default async (loginType, data) => {
  // 带着accessToken和用户信息进行登录尝试
  const code = await store.dispatch('user/handleLogin', {
    loginType,
    ...data
  })
  // code为 204 用户未进行注册
  if (code === OAUTH_LOGIN_NO_REGISTER_CODE) {
    return router.push({
      path: '/register',
      query: data
    })
  }
  // 用户已注册
  router.push('/')
}
