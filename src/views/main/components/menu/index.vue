<template>
  <div class="flex flex-col h-[70vh]">
    <h2 class="px-1 py-2 text-zinc-900 text-lg">全部分类</h2>
    <ul class="flex-1 overflow-auto">
      <li
        class="p-1 text-zinc-700 text-base"
        v-for="(category, index) in categorys"
        :key="category.id"
        @touchstart="onTouchStart(index)"
        @touchmove="onTouchmove(index)"
        @touchend="onTouchEnd(index)"
      >
        {{ category.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
const store = useStore()
const categorys = computed(() => store.getters.categorys)
const emits = defineEmits(['handleSelectCategory'])
let isMoved = false
// 解决点击穿透的问题
const onTouchStart = (index) => {
  isMoved = false
}
const onTouchmove = (index) => {
  isMoved = true
}
const onTouchEnd = (index) => {
  if (!isMoved) {
    emits('handleSelectCategory', index)
  }
}
</script>

<style></style>
