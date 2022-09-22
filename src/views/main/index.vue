<template>
  <div class="h-screen overflow-auto bg-white dark:bg-zinc-800 duration-300">
    <!-- <div>这是移动端mian页面</div> -->
    <div class="sticky left-0 top-0 right-0 z-10 duration-300">
      <navigation />
    </div>
    <!-- 瀑布流部分 -->
    <div class="max-w-screen-xl mx-auto px-1 xl:px-0">
      <list />
    </div>

    <trigger-menu
      class="fixed w-[280px] left-[50%] bottom-[30px] translate-x-[-50%]"
      v-if="isMoboleTerminal"
    >
      <trigger-menu-item icon="home" to="/"> 首页 </trigger-menu-item>
      <trigger-menu-item icon="vip" to="/member" v-if="isLogin">
        VIP
      </trigger-menu-item>
      <trigger-menu-item icon="profile" @click="handleProfile">
        {{ isLogin ? '我的' : '去登陆' }}
      </trigger-menu-item>
    </trigger-menu>
  </div>
</template>

<script>
export default {
  name: 'main'
}
</script>

<script setup>
import Navigation from './components/navigation/index.vue'
import List from './components/list/index.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { isMoboleTerminal } from '@/utils/flexible'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
const isLogin = computed(() => !!store.getters.token)
const handleProfile = () => {
  if (isLogin.value) {
    router.push('/profile')
  } else {
    router.push('/login')
  }
}
</script>
