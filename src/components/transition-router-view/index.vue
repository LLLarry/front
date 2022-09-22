<template>
  <router-view v-slot="{ Component }" v-if="isStartTransition">
    <transition
      :name="transitionName"
      @before-enter="onBeforeEnter"
      @after-enter="onAfterEnter"
    >
      <!-- 在页面跳转之前、将缓存的组件name属性值放到virtualTaskList中；当模板解析到此处时，会判断virtualTaskList数组中是否包含当前模板的name属性值？ 包含则缓存、不包含则不缓存 -->
      <!-- 动态组件，加key的作用是处理/user/1 和 /user/2这样的情况 -->
      <keep-alive :include="virtualTaskList">
        <component :is="Component" :key="$route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
  <router-view v-slot="{ Component }" v-else>
    <keep-alive :include="virtualTaskList">
      <component :is="Component" :key="$route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

import {
  ROUTER_TYPE_NONE,
  ROUTER_TYPE_PUSH,
  ROUTER_TYPE_BACK
} from '@/constants'
import { computed } from 'vue'
import useVirtualTask from './useVirtualTask'
const props = defineProps({
  routerType: {
    type: String,
    validator(v) {
      const routerTypes = [ROUTER_TYPE_NONE, ROUTER_TYPE_PUSH, ROUTER_TYPE_BACK]
      if (!routerTypes.includes(v)) {
        throw new TypeError(`routerTypes must be ${routerTypes.join(',')}`)
      }
      return true
    }
  },
  mainComponentName: {
    // 首页组件名称；当跳转到首页时，清空任务栈
    type: String,
    required: true
  }
})
const route = useRoute()
const store = useStore()

const transitionName = computed(() => `${props.routerType}`)

// 组件进入之前的回调， 设置组件为固定定位
const onBeforeEnter = (el) => {
  if (transitionName.value === ROUTER_TYPE_NONE) return false
  el.style = 'position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;'
  console.log('onBeforeEnter')
}
// 进入之后的回调，移除固定定位
const onAfterEnter = (el) => {
  if (transitionName.value === ROUTER_TYPE_NONE) return false
  el.removeAttribute('style')
  store.commit('app/changeRouterType', ROUTER_TYPE_NONE)
  console.log('onAfterEnter')
}
const { virtualTaskList, isStartTransition } = useVirtualTask(
  props.mainComponentName
)
</script>

<style lang="scss" scoped>
.push-enter-from {
  transform: translateX(100%);
}
.push-leave-to {
  transform: translateX(-50%);
}
.push-enter-active,
.push-leave-active {
  transition: all 0.4s ease-in-out;
}

.back-enter-from {
  transform: translateX(-100%);
}
.back-leave-to {
  transform: translateX(50%);
}

.back-enter-active,
.back-leave-active {
  transition: all 0.4s ease-in-out;
}

/* .none-enter-from {

}
.none-leave-to {
  opacity: 0;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

.none-enter-active,
.none-leave-active {
  transition: none;
} */
</style>
