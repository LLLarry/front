import { getToken, getProfile, registerUser } from '@/api/sys'
import md5 from 'md5'
import Message from '@/libs/message'
import router from '@/router'
import { LOGIN_TYPE_USERNAME, OAUTH_LOGIN_NO_REGISTER_CODE } from '@/constants'

export default {
  namespaced: true,
  state() {
    return {
      token: '',
      userInfo: {}
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    async handleRegister(context, payload) {
      // 注册用户
      await registerUser({
        ...payload,
        password: payload.password ? md5(payload.password) : ''
      })
      // 登录用户
      context.dispatch('handleLogin', {
        ...payload,
        loginType: payload.loginType || LOGIN_TYPE_USERNAME
      })
    },
    async handleLogin(context, { redirect, ...payload }) {
      try {
        // 登录、获取token 当有password时，进行md5加密

        const { token, code } = await getToken({
          ...payload,
          password: payload.password ? md5(payload.password) : ''
        })
        // code 204表示未注册
        if (code === OAUTH_LOGIN_NO_REGISTER_CODE) {
          return code
        }
        // 存储token
        context.commit('setToken', token)
        // 获取用户信息
        const userInfo = await getProfile()
        context.commit('setUserInfo', userInfo)
        Message.success(
          `欢迎您 ${
            userInfo.vipLevel
              ? `最贵的VIP${userInfo.vipLevel}用户 ${userInfo.nickname}`
              : userInfo.nickname
          }`
        )
        // 跳转到首页
        router.replace(redirect ? decodeURIComponent(redirect) : '/')
      } catch (error) {
        return Promise.reject(error)
      }
    },
    handleLogout(context) {
      // 清除token
      context.commit('setToken', '')
      // 清除user
      context.commit('setUserInfo', {})
      // 刷新页面
      window.location.reload()
    }
  }
}
