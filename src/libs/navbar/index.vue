<template>
  <div :class="stickyClass" class="w-screen h-4 bg-white border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 flex items-center justify-between">
    <!-- 左边部分 -->
    <div class="w-4 h-4 flex items-center justify-center" @click="onClickLeft">
      <slot name="left">
        <svg-icon name="back" class="w-2 h-2 fill-zinc-900 dark:fill-zinc-200"></svg-icon>
      </slot>
    </div>
    <!-- 中间部分 -->
      <div class="h-4 mx-auto flex items-center justify-center text-base whitespace-nowrap overflow-hidden text-ellipsis">
        <slot></slot>
      </div>
    <!-- 右边部分 -->
    <div class="h-4 w-4 flex items-center justify-center" @click="onClickRight"> 
      <slot name="right" ></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue-demi'
import { useRouter } from 'vue-router'
const props = defineProps({
  onClickLeft: Function,
  onClickRight: Function,
  sticky: {
    type: Boolean,
    default: false
  }
})
const stickyClass = computed(() => {
  return props.sticky ? 'sticky left-0 top-0 z-50' : ''
})
const router = useRouter()
const onClickLeft = () => {
  if (!props.onClickLeft) {
    router.back()
  }
  props.onClickLeft?.()
}
const onClickRight = () => {
  props.onClickRight?.()
}
</script>