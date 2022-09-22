/**
 * 处理虚拟任务栈
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  ROUTER_TYPE_NONE,
  ROUTER_TYPE_PUSH,
  ROUTER_TYPE_BACK
} from '@/constants'
export default (mainComponentName) => {
  // 虚拟任务栈数据， 里面存放的是组件的name属性值
  const virtualTaskList = ref([mainComponentName])
  const isStartTransition = ref(true)
  const router = useRouter()
  const store = useStore()

  // 监听页面跳转 注意： to.name 是路由对象name属性,一般是用来做跳转的、而keep-alive的include属性判断的是组件name属性，两者是不同的
  // 这里缓存的是路由对象name属性，所以就要求我们在定义组件和路由时，name保持一致
  router.beforeEach((to, from) => {
    isStartTransition.value = true
    // 获取当前跳转类型 push / back
    const routerType = store.getters.routerType
    // 当跳转到首页时，清空任务栈、只保留首页的任务栈
    if (to.name === mainComponentName) {
      cleanVirtualTaskList()
    } else if (routerType === ROUTER_TYPE_PUSH) {
      // 入栈操作
      virtualTaskList.value.push(to.name)
    } else if (routerType === ROUTER_TYPE_BACK) {
      // 出栈操作
      virtualTaskList.value.pop()
    } else {
      // 这种跳转不是通过api来进行跳转，比如： 前进后退、左右滑动前进后退
      isStartTransition.value = false
    }
  })

  // 清空虚拟任务栈
  const cleanVirtualTaskList = () => {
    virtualTaskList.value = [mainComponentName]
  }
  return { virtualTaskList, isStartTransition }
}
