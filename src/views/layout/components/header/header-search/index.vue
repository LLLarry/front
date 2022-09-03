<template>
  <div class="h-header flex items-center px-2 dark:bg-zinc-800 duration-500">
    <!-- logo -->
    <header-logo class="guide-logo" />

    <!-- 搜索区域 -->
    <search v-model="keywords" @confirm="onConfirm" class="guide-search">
      <template #dropdown>
        <Hint :searchText="keywords" @item-click="itemClick" v-if="keywords" />
        <template v-else>
          <History @itemClick="itemClick" />
          <Theme />
        </template>
      </template>
    </search>

    <!-- 主题选择 -->
    <header-theme class="guide-theme" />

    <!-- 个人中心 -->
    <header-my class="guide-my" />
  </div>
</template>

<script setup>
import HeaderLogo from './header-logo.vue'
import HeaderTheme from './header-theme.vue'
import HeaderMy from './header-my.vue'
import Hint from './hint.vue'
import History from './history.vue'
import Theme from './theme.vue'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const keywords = ref('')
const onConfirm = ({ value }) => {
  if (!value) return false
  // 保存搜索历史到vuex中
  store.commit('search/addHistory', value)
}

const itemClick = (v) => {
  keywords.value = v
}

watch(keywords, (v) => {
  store.commit('app/changeSearchText', v)
})
</script>
