import { createRouter, createWebHistory } from 'vue-router'
import { isMoboleTerminal } from '../utils/flexible'
import mobileRoutes from './modules/mobile-routes'
import pcRoutes from './modules/pc-routes'
import store from '@/store'
import { ROUTER_TYPE_PUSH, ROUTER_TYPE_BACK } from '@/constants'

const router = createRouter({
  history: createWebHistory(),
  routes: isMoboleTerminal.value ? mobileRoutes : pcRoutes
  // scrollBehavior(to, from, savedPosition) {
  //   console.log(to, from, savedPosition)
  //   // return savedPosition
  // }
})

const originPush = router.push
const originBack = router.back
// 前进操作
router.push = function (...argu) {
  store.commit('app/changeRouterType', ROUTER_TYPE_PUSH)
  originPush.apply(this, argu)
}
// 后退操作
router.back = function (...argu) {
  store.commit('app/changeRouterType', ROUTER_TYPE_BACK)
  originBack.apply(this, argu)
}
export default router
