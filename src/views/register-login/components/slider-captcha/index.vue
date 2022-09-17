<template>
  <div
    class="w-[360px] border text-sm border-zinc-300 rounded-sm bg-white p-1 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 duration-300 fixed z-50 left-1/2 top-1/3 translate-x-[-50%] translate-y-[-50%]"
  >
    <div class="h-4 flex items-center text-sm">
      <span class="flex-grow">请完成安全验证</span>
      <div @click="onRefresh">
        <svg-icon
          name="refresh"
          class="w-2 h-2 rounded-sm fill-zinc-600 dark:fill-zinc-300 duration-300 cursor-pointer"
        ></svg-icon>
      </div>

      <div class="ml-2" @click="onClose">
        <svg-icon
          name="close"
          class="w-2 h-2 rounded-sm fill-zinc-600 dark:fill-zinc-300 duration-300 cursor-pointer"
        ></svg-icon>
      </div>
    </div>
    <div id="captcha" class="h-[195px]"></div>
  </div>
</template>

<script>
const EMITS_SUCCESS = 'success'
const EMITS_CLOSE = 'close'
</script>

<script setup>
import '@/vendor/SliderCaptcha/longbow.slidercaptcha.min.js'
import '@/vendor/SliderCaptcha/slidercaptcha.min.css'
import { onMounted } from 'vue'
const emits = defineEmits([EMITS_SUCCESS, EMITS_CLOSE])
let sc = null
onMounted(() => {
  sc = sliderCaptcha({
    id: 'captcha',
    loadingText: '正在加载中...',
    failedText: '再试一次',
    barText: '向右滑动填充拼图',
    repeatIcon: 'fa fa-redo',
    setSrc: () =>
      'https://images.pexels.com/photos/9909478/pexels-photo-9909478.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    onSuccess: function (arr) {
      console.log('成功')
      emits(EMITS_SUCCESS, arr)
    },
    onFail: function () {
      console.log('失敗')
    },
    verify: function () {
      return true
    }
  })
})

// 点击刷新按钮
const onRefresh = () => {
  console.log('刷新')
  sc?.reset()
}
// 点击关闭按钮
const onClose = () => {
  console.log('关闭')
  emits(EMITS_CLOSE)
}
</script>

<style></style>
