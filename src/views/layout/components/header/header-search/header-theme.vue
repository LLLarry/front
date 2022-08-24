<template>
  <div class="ml-2">
    <popover trigger="hover" placement="bottom-end">
      <template #reference>
        <div
          class="w-4 h-4 hover:bg-zinc-100 rounded-sm flex items-center justify-center duration-300 cursor-pointer"
        >
          <svg-icon name="theme-light" class="w-2.5 h-2.5" />
        </div>
      </template>

      <!-- 菜单 -->
      <div
        class="text-sm cursor-pointer w-[140px] overflow-hidden text-zinc-600"
      >
        <div
          v-for="theme in themes"
          :key="theme.id"
          class="flex items-center p-1 hover:bg-zinc-100/60 duration-300"
        >
          <svg-icon :name="theme.icon" class="w-1.5 h-1.5 mr-1 fill-zinc-600" />
          <div>{{ theme.name }}</div>
        </div>
      </div>
    </popover>
  </div>
</template>

<script setup>
import { THEME_LIGHT, THEME_DARK, THEME_SYSTEM } from '@/constants'
const themes = [
  {
    id: 0,
    type: THEME_LIGHT,
    name: '极简白',
    icon: 'theme-light'
  },
  {
    id: 1,
    type: THEME_DARK,
    name: '极夜黑',
    icon: 'theme-dark'
  },
  {
    id: 2,
    type: THEME_SYSTEM,
    name: '跟随系统',
    icon: 'theme-system'
  }
]
</script>

<style></style>
