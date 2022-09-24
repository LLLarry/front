<template>
  <div
    class="scroll fixed w-screen h-screen left-0 top-0 right-0 bottom-0 z-50 dark:bg-zinc-800 duration-500 xl:p-4 overflow-y-auto xl:backdrop-blur-3xl backdrop-blur-none z-[-1px] bg-white xl:bg-transparent"
  >
    <!-- 关闭按钮 -->
    <div
      class="absolute right-4 top-4 cursor-pointer hidden xl:block"
      @click="goBack"
    >
      <svg-icon name="close" class="w-2 h-2 fill-zinc-500"></svg-icon>
    </div>
    <navbar sticky v-if="isMoboleTerminal" :onClickRight="handleShare">
      {{ pins.title }}
      <template #right>
        <svg-icon name="share" class="fill-zinc-900 w-2.5 h-2.5" />
      </template>
    </navbar>
    <!-- 核心区域 -->
    <div
      class="xl:w-4/5 xl:rounded-md overflow-hidden xl:flex h-full m-auto relative"
    >
      <div class="xl:flex-[5] w-screen xl:w-auto">
        <img
          :src="pins.photo"
          alt=""
          class="object-contain xl:object-cover w-full h-full"
        />
      </div>
      <div
        class="xl:flex-[3] bg-white dark:bg-zinc-800 duration-500 xl:p-3 p-1"
      >
        <div class="flex justify-between" v-if="!isMoboleTerminal">
          <Button
            class="bg-transparent hover:bg-zinc-400/60 duration-300"
            type="default"
            @click="handleShare"
          >
            <svg-icon name="share" class="fill-zinc-600 w-2 h-2" />
          </Button>
          <Button
            class="bg-zinc-400/60 hover:bg-zinc-400/90 duration-300 fill-zinc-900"
            type="default"
          >
            <svg-icon name="heart" class="fill-zinc-900 w-2 h-2" />
          </Button>
        </div>
        <h1 class="text-lg xl:mt-3 xt-2 font-bold">{{ pins.title }}</h1>

        <div class="flex items-center mt-3">
          <img class="w-3 h-3 rounded-full mr-2" :src="pins.avatar" alt="" />
          <span class="text-base">{{ pins.author }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { getPinsById } from '@/api/pexels'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { isMoboleTerminal } from '@/utils/flexible'
import { useMobileScroll } from '@/utils'
import weiboShare from '@/utils/weiboShare'
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})
const router = useRouter()
const pins = ref({})

const getPinsByIdData = async () => {
  const data = await getPinsById({ id: props.id })
  console.log(data)
  pins.value = data
}
const goBack = () => {
  router.back()
}
getPinsByIdData()

// 分享
const handleShare = () => {
  weiboShare(
    pins.value.photo,
    `${window.location.origin}/pins/${pins.value.id}`
  )
}
</script>

<style></style>
