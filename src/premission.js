// 用户权限控制
import router from '@/router'
import store from '@/store'

router.beforeEach((to, from) => {
  // 访问的路由不需要用户登录时直接跳转到指定路由
  if (!to.meta.user) {
    return true // 允许跳转
  }

  // 用户是否已登录
  if (Object.keys(store.getters.userInfo).length > 0) {
    return true // 允许跳转
  }

  return '/' // 重定向到首页
})
