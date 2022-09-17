<template>
  <!-- 遮罩层 -->
  <transition name="fade">
    <div
      class="bg-zinc-900/80 fixed w-full h-screen left-0 top-0 z-50"
      v-if="modelValue"
      @click="onClose"
    ></div>
  </transition>
  <!-- 内容 -->
  <transition name="up">
    <div
      class="max-w-[80%] min-w-[256px] bg-white rounded p-1.5 dark:bg-zinc-800 z-50 fixed left-1/2 top-1/3 translate-x-[-50%]"
      v-if="modelValue"
    >
      <!-- title标题 -->
      <div class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
        {{ title }}
      </div>
      <!-- content内容 -->
      <div class="text-sm text-zinc-700 dark:text-zinc-300">
        <slot />
      </div>
      <!-- 底部按钮 -->
      <slot name="footer">
        <div class="flex justify-end items-center">
          <Button type="default" class="mr-1" @click="onCancel">{{
            cancelText
          }}</Button>
          <Button type="primary" @click="onOk" :loading="loading">{{
            okText
          }}</Button>
        </div>
      </slot>
    </div>
  </transition>
</template>

<script setup>
import Button from '../Button/index.vue'
import { onMounted, ref } from 'vue'

const DURATION = '0.5s' // 定义过渡时间
const props = defineProps({
  modelValue: {
    // 控制开关
    type: Boolean,
    required: true
  },
  title: {
    // 标题
    type: String
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
const emits = defineEmits(['update:modelValue'])
// 关闭事件
const onClose = () => {
  emits('update:modelValue', false)
}
const loading = ref(false)
// 取消事件
const onCancel = () => {
  props.onCancel?.()
  onClose()
}

// 取消确认
const onOk = () => {
  if (!props.onOk) {
    onClose()
    return false
  }
  const result = props.onOk()
  // 判断 result 是不是promise对象？ 如果是则`promise`的状态变为`成功状态时`才会关闭`Dialog`，如果不是则直接关闭
  if (result && result.then && typeof result.then === 'function') {
    loading.value = true
    result
      .then(() => {
        onClose()
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    onClose()
  }
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
