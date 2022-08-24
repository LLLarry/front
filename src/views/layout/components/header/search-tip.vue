<template>
  <transition name="search-tip">
    <div
      class="absolute left-0 right-0 bottom-0 rounded-sm bg-white border border-zinc-300 translate-y-full p-1 max-h-[270px] overflow-auto"
      v-if="visible"
    >
      <div class="mb-1 flex items-center">
        <div class="text-zinc-400 text-sm">最近搜索</div>
        <div class="cursor-pointer ml-2">
          <svg-icon name="delete" class="w-1.5 h-1.5" color="#888888" />
        </div>
      </div>

      <div class="flex flex-wrap">
        <div
          class="py-1 px-2 rounded-sm bg-zinc-100 mr-2 mb-1 flex items-center font-semibold cursor-pointer hover:bg-zinc-200"
          v-for="item in 5"
          :key="item"
        >
          <span class="text-sm">item</span>
          <div class="ml-1">
            <svg-icon name="input-delete" class="w-1.5 h-1.5" />
          </div>
        </div>
      </div>

      <!-- 热门精选 -->
      <div class="mb-1 flex items-center">
        <div class="text-zinc-400 text-sm">热门精选</div>
      </div>

      <div class="flex">
        <div
          class="w-[260px] h-[140px] overflow-hidden rounded-md relative flex-shrink-0"
        >
          <img
            class="w-full object-contain"
            src="https://images.pexels.com/videos/8091554/burglar-country-house-couple-couple-hugging-8091554.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=250&w=360"
            alt=""
          />
          <p
            class="absolute left-0 bottom-0 right-0 h-[63px] backdrop-blur text-sm px-1 text-white cursor-pointer flex items-center hover:backdrop-blur-none duration-300"
          >
            # 爱情
          </p>
        </div>

        <div class="flex flex-wrap">
          <div
            class="w-[260px] h-[63px] overflow-hidden rounded-md relative mb-1.5 ml-1.5"
            v-for="item in 10"
            :key="item"
          >
            <img
              class="w-full object-contain"
              src="https://images.pexels.com/videos/8091554/burglar-country-house-couple-couple-hugging-8091554.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=250&w=360"
              alt=""
            />
            <p
              class="absolute left-0 bottom-0 right-0 h-[63px] backdrop-blur text-sm px-1 text-white cursor-pointer flex items-center hover:backdrop-blur-none duration-300"
            >
              # 爱情
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const visible = ref(false)

// 点击search任何地方关闭提示栏
function handleEvent() {}
onMounted(() => {
  document.addEventListener('click', handleEvent)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleEvent)
})
</script>
