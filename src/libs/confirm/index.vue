<template>
  <!-- 遮罩层 -->
  <transition name="fade">
    <div
      class="bg-zinc-900/80 fixed w-full h-screen left-0 top-0 z-50"
      v-if="visible"
      @click="onClose"
    ></div>
  </transition>
  <!-- 内容 -->
  <transition name="up">
    <div
      class="w-[80%] bg-white rounded p-1.5 dark:bg-zinc-800 z-50 xl:w-1/3 fixed left-1/2 top-1/3 translate-x-[-50%]"
      v-if="visible"
    >
      <!-- title标题 -->
      <div class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
        {{ title }}
      </div>
      <!-- content内容 -->
      <div class="text-sm text-zinc-700 dark:text-zinc-300">
        {{ content }}
      </div>
      <!-- 底部按钮 -->
      <div class="flex justify-end items-center">
        <Button type="default" class="mr-1" @click="onCancel">{{
          cancelText
        }}</Button>
        <Button type="primary" @click="onOk">{{ okText }}</Button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import Button from '../Button/index.vue'
import { onMounted, ref } from 'vue'
const DURATION = '0.5s' // 定义过渡时间
const props = defineProps({
  title: {
    // 标题
    type: String
  },
  content: {
    // 内容
    type: String,
    required: true
  },
  cancelText: {
    // 删除按钮文字
    type: String,
    default: '取消'
  },
  okText: {
    // 确认按钮文字
    type: String,
    default: '确认'
  },
  onCancel: {
    // 取消按钮事件
    type: Function
  },
  onOk: {
    // 确认按钮事件
    type: Function
  },
  close: {
    // 关闭按钮事件
    type: Function
  }
})
// confirm是否可见
const visible = ref(false)
// 这里onMounted的作用是，等待组件挂载到页面之后再执行就会有动画效果
onMounted(() => {
  visible.value = true
})
// 关闭事件
const onClose = () => {
  visible.value = false
  // 等动画执行完之后再再调用close事件
  setTimeout(() => {
    props.close?.()
  }, Number.parseFloat(DURATION) * 1000)
}
// 取消事件
const onCancel = () => {
  props.onCancel?.()
  onClose()
}

// 取消确认
const onOk = () => {
  props.onOk?.()
  onClose()
}
</script>

<style lang="scss" scoped>
/* 遮罩层过渡 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all v-bind('DURATION') ease-in-out;
}

/* 弹框过渡 */
.up-enter-from,
.up-leave-to {
  transform: translate3d(-50%, 100px, 0);
  opacity: 0;
}
.up-enter-active,
.up-leave-active {
  transition: all v-bind('DURATION') ease-in-out;
}
</style>
