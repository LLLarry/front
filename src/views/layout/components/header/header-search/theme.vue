<template>
  <div class="mb-[-15px]">
    <!-- 热门精选 -->
    <div class="mb-1 flex items-center">
      <div class="text-zinc-400 text-sm">热门精选</div>
    </div>

    <div class="flex">
      <div
        class="w-[260px] h-[140px] overflow-hidden rounded-sm relative flex-shrink-0"
        v-bg-color="createRandomColor()"
      >
        <img
          v-lazy
          class="w-full object-contain"
          :src="themesData.big.photo"
          alt=""
        />
        <p
          class="absolute left-0 bottom-0 right-0 h-[63px] backdrop-blur text-sm px-1 text-white cursor-pointer flex items-center hover:backdrop-blur-none duration-300"
        >
          # {{ themesData.big.title }}
        </p>
      </div>

      <div class="flex flex-wrap flex-1">
        <div
          class="w-[31%] h-[63px] overflow-hidden rounded-sm relative mb-1.5 ml-[2%] text-[0px]"
          v-for="item in themesData.small"
          :key="item.id"
          v-bg-color="createRandomColor()"
        >
          <img v-lazy class="w-full object-contain" :src="item.photo" alt="" />
          <p
            class="absolute left-0 bottom-0 right-0 h-[63px] rounded-sm backdrop-blur text-sm px-1 text-white cursor-pointer flex items-center hover:backdrop-blur-none duration-300"
          >
            # {{ item.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getThemes } from '@/api/pexels'
import { ref } from 'vue'
import { createRandomColor } from '@/utils'
const themesData = ref({
  big: {},
  small: [{}, {}, {}, {}, {}, {}]
})

const getThemesData = async () => {
  const { themes } = await getThemes()
  themesData.value = {
    big: themes.shift(),
    small: themes
  }
}
getThemesData()
</script>

<style></style>
