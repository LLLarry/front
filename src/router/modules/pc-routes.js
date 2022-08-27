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
      }
    ]
  }
]
