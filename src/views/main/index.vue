<template>
  <div class="h-full overflow-auto">
    <!-- <div>这是移动端mian页面</div> -->
    <div class="sticky left-0 top-0 right-0 z-10 duration-300">
      <navigation />
    </div>
    <!-- 瀑布流部分 -->
    <div class="max-w-screen-xl mx-auto px-1 xl:px-0">
      <list />
    </div>
  </div>

  <trigger-menu
    class="fixed w-[280px] left-[50%] bottom-[30px] translate-x-[-50%]"
    v-if="isMoboleTerminal"
  >
    <trigger-menu-item icon="home" to="/"> 首页 </trigger-menu-item>
    <trigger-menu-item icon="vip" v-if="isLogin"> VIP </trigger-menu-item>
    <trigger-menu-item icon="profile" @click="handleProfile">
      {{ isLogin ? '我的' : '去登陆' }}
    </trigger-menu-item>
  </trigger-menu>
</template>

<script setup>
import Navigation from './components/navigation/index.vue'
import List from './components/list/index.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { isMoboleTerminal } from '@/utils/flexible'
const store = useStore()
const isLogin = computed(() => !!store.getters.token)
const handleProfile = () => {
  console.log(123)
}
</script>

<style></style>
