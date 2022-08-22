import { createRouter, createWebHistory } from 'vue-router'
import { isMoboleTerminal } from '../utils/flexible'
import mobileRoutes from './modules/mobile-routes'
import pcRoutes from './modules/pc-routes'

const router = createRouter({
  history: createWebHistory(),
  routes: isMoboleTerminal.value ? mobileRoutes : pcRoutes
})

export default router
