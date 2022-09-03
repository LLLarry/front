export default [
  {
    path: '/',
    name: 'pc首页',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'main',
        component: () => import('@/views/main/index.vue')
      },
      {
        path: '/pins/:id',
        name: 'pins-id',
        props: true,
        component: () => import('@/views/pins/components/pins.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/register-login/login/index.vue')
  }
]
