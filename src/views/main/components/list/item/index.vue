<template>
  <div
    class="bg-white dark:bg-zinc-900 dark:xl:bg-zinc-800 rounded overflow-hidden"
    :style="{ width: width + 'px' }"
  >
    <div class="rounded w-full cursor-zoom-in relative group">
      <img
        :src="pexel.photo"
        alt=""
        class="w-full rounded"
        :style="imgStyle"
        v-bg-color="createRandomColor()"
        v-lazy
      />
      <div
        class="absolute left-0 top-0 right-0 bottom-0 opacity-0 group-hover:bg-zinc-800/60 group-hover:opacity-100 duration-300"
      >
        <!-- 分享 -->
        <Button
          type="danger"
          class="absolute left-1.5 top-1.5 dark:bg-zinc-900 dark:text-zinc-300 border-none"
          >分享</Button
        >
        <!-- 收藏 -->
        <Button
          type="default"
          class="absolute right-1.5 top-1.5 bg-white dark:bg-zinc-900/60 border-none"
        >
          <svg-icon
            name="heart"
            class="fill-zinc-800 w-2 h-2 dark:fill-zinc-200"
          />
        </Button>
        <!-- 下载 -->
        <Button
          type="default"
          size="small"
          class="absolute left-1.5 bottom-1.5 bg-zinc-200/50 border-none dark:bg-zinc-900/60"
        >
          <svg-icon
            name="download"
            class="fill-zinc-600 w-2 h-2 dark:fill-zinc-200"
          />
        </Button>
        <!-- 全屏 -->
        <Button
          type="default"
          size="small"
          class="absolute right-1.5 bottom-1.5 bg-zinc-200/50 border-none dark:bg-zinc-900/60"
        >
          <svg-icon
            name="full"
            class="fill-zinc-600 w-2 h-2 dark:fill-zinc-200"
          />
        </Button>
      </div>
    </div>

    <h3 class="font-bold text-zinc-800 mt-1 text-sm dark:text-zinc-300 px-1">
      {{ pexel.title }}
    </h3>
    <div class="flex items-center mt-1 px-1 pb-1">
      <img
        v-lazy
        :src="pexel.avatar"
        alt=""
        class="w-2 h-2 rounded-full overflow-hidden mr-1"
      />
      <span class="text-zinc-400 text-sm">{{ pexel.author }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { createRandomColor } from '@/utils'

const props = defineProps({
  pexel: {
    type: Object,
    required: true,
    default: () => ({})
  },
  width: {
    // 每一列的宽
    type: Number
  }
})

// 图片预加载时的宽高
const imgStyle = computed(() => {
  const { photoHeight, photoWidth } = props.pexel
  const height = (props.width / photoWidth) * photoHeight
  if (isNaN(height)) return {}
  return {
    height: height + 'px'
  }
})
</script>

<style></style>
