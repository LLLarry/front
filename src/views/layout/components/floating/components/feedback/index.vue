<template>
  <div
    class="rounded-sm p-1 border border-zinc-300 bg-white flex items-center text-zinc-700 w-[150px] cursor-pointer duration-300 dark:bg-zinc-900 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-800"
    @click="handleGoFree"
  >
    <svg-icon
      name="feedback"
      class="w-1.5 h-1.5 fill-zinc-800 dark:fill-zinc-300 duration-300"
    ></svg-icon>
    <span class="text-sm ml-1 text-zinc-600 dark:text-zinc-300">立即吐槽</span>

    <!-- 携带者用户登录参数跳转至兔小巢 -->
    <form
      v-show="false"
      method="post"
      action="https://support.qq.com/product/383681"
    >
      <input type="hidden" name="openid" :value="userInfo.wxOpenId" />
      <input type="hidden" name="nickname" :value="userInfo.nickname" />
      <input type="hidden" name="avatar" :value="userInfo.avatar" />
      <button type="submit" ref="submitBtn" />
    </form>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import Message from '@/libs/message/index.js'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
const store = useStore()
const router = useRouter()
const submitBtn = ref(null)

const userInfo = computed(() => store.getters.userInfo)

const handleGoFree = () => {
  if (Object.keys(userInfo.value).length <= 0) {
    Message.warning('请先进行登录后再吐槽！')
    setTimeout(() => {
      router.push({
        path: '/login',
        query: {
          redirect: encodeURIComponent('/')
        }
      })
    }, 2500)
    return false
  }
  submitBtn.value.click()
}
</script>

<style></style>
