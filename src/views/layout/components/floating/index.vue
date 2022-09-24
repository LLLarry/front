<template>
  <div class="fixed right-2 bottom-10 floationg">
    <!-- 引导页 -->
    <div
      class="group guide-start w-4 h-4 rounded-full border dark:border-zinc-800 border-zinc-200 flex items-center justify-center bg-white dark:bg-zinc-900 duration-300 cursor-pointer hover:shadow-lg"
      @click="handleStartDriver"
    >
      <svg-icon
        name="guide"
        class="w-2 h-2 fill-zinc-800 group-hover:fill-purple-400 dark:fill-zinc-300 duration-300"
      ></svg-icon>
    </div>
    <!-- 反馈 -->
    <popover placement="bottom-end" trigger="hover">
      <template #reference>
        <div
          class="group guide-feedback w-4 h-4 rounded-full border dark:border-zinc-800 border-zinc-200 flex items-center justify-center bg-white dark:bg-zinc-900 duration-300 cursor-pointer hover:shadow-lg mt-1"
        >
          <svg-icon
            name="feedback"
            class="w-2 h-2 fill-zinc-800 group-hover:fill-purple-400 dark:fill-zinc-300 duration-300"
          ></svg-icon>
        </div>
      </template>
      <!-- 立即吐槽 -->
      <Feedback />
    </popover>
  </div>
</template>

<script setup>
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import { onMounted } from 'vue'
import steps from './setps'
import Feedback from './components/feedback/index.vue'
let driver = null
onMounted(() => {
  setTimeout(() => {
    driver = new Driver({
      allowClose: false,
      nextBtnText: '下一步', // Next button text for this step
      prevBtnText: '上一步' // Previous button text for this step
    })
    driver.defineSteps(steps)
  }, 100)
})
const handleStartDriver = () => {
  console.log(driver)
  driver?.start()
}
</script>
