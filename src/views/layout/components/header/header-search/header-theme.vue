<template>
  <div class="ml-2">
    <popover trigger="hover" placement="bottom-end">
      <template #reference>
        <div
          class="w-4 h-4 hover:bg-zinc-100 rounded-sm flex items-center justify-center duration-300 cursor-pointer dark:hover:bg-zinc-900"
        >
          <svg-icon
            :name="selectIconc"
            class="w-2.5 h-2.5 dark:fill-zinc-400"
          />
        </div>
      </template>

      <!-- 菜单 -->
      <div
        class="text-sm cursor-pointer w-[140px] overflow-hidden text-zinc-600 dark:bg-zinc-800"
      >
        <div
          v-for="theme in themes"
          :key="theme.id"
          class="flex items-center p-1 hover:bg-zinc-100/60 duration-300 dark:hover:bg-zinc-700 dark:text-zinc-300"
          @click="handleSelect(theme)"
        >
          <svg-icon
            :name="theme.icon"
            class="w-1.5 h-1.5 mr-1 fill-zinc-600 dark:fill-zinc-300"
          />
          <div>{{ theme.name }}</div>
        </div>
      </div>
    </popover>
  </div>
</template>

<script setup>
import { THEME_LIGHT, THEME_DARK, THEME_SYSTEM } from '@/constants'
import { computed } from 'vue-demi'
import { useStore } from 'vuex'
const store = useStore()
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

// 选中主题
const handleSelect = (theme) => {
  // 修改vuex中的主题
  store.commit('theme/changeTheme', theme.type)
}

// 当前选中的模式的icon图标
const selectIconc = computed(() => {
  // 当前选中的主题类型
  const themeType = store.getters.themeType
  // 对应的themes中的项
  const item = themes.find((theme) => theme.type === themeType)
  // 返回选中项的图标
  return item?.icon
})
</script>

<style></style>
