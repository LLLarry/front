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
</template>

<script setup>
import Navigation from './components/navigation/index.vue'
import List from './components/list/index.vue'
</script>

<style></style>
