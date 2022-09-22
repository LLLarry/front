<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from '@/components/HelloWorld.vue'
import { isMoboleTerminal } from '@/utils/flexible'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import TestGSAP from '@/components/testGSAP/index.vue'
import TransitionRouterView from '@/components/transition-router-view/index.vue'

const store = useStore()
// 获取当前主题下对应的滚动条样式
const scrollTheme = computed(() => store.getters.scrollTheme)
</script>

<template>
  <!-- <TestGSAP /> -->
  <div class="w-full h-full">
    <transition-router-view
      :routerType="$store.getters.routerType"
      mainComponentName="main"
    />
  </div>
</template>

<style lang="scss" scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<style lang="scss">
@media screen and (min-width: 1280px) {
  /*定义滚动条高宽及背景

 高宽分别对应横竖滚动条的尺寸*/

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  /*定义滚动条轨道
 
  内阴影+圆角*/

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: v-bind('scrollTheme.track.boxShadow');
    border-radius: 10px;
    background-color: v-bind('scrollTheme.track.bgc');
  }

  /*定义滑块
 
  内阴影+圆角*/

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: v-bind('scrollTheme.thumb.boxShadow');
    background-color: v-bind('scrollTheme.thumb.bgc');
  }
}
</style>
