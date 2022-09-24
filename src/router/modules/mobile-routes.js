export default [
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/main/index.vue')
  },
  {
    path: '/pins/:id',
    name: 'pins-id',
    component: () => import('@/views/pins/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/register-login/login/index.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register-login/register/index.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: {
      user: true
    }
  },
  {
    path: '/member',
    name: 'member',
    component: () => import('@/views/member/index.vue'),
    meta: {
      user: true
    }
  },
  {
    path: '/pay/result',
    name: 'pay-result',
    component: () => import('@/views/pay/index.vue')
  }
]
