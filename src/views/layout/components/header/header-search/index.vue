<template>
  <div class="h-header flex items-center px-2 dark:bg-zinc-800 duration-500">
    <header-logo />
    <search v-model="keywords" @confirm="onConfirm" @input="onInput">
      <template #dropdown>
        <Hint :searchText="keywords" @item-click="itemClick" />
      </template>
    </search>
    <header-theme />
    <header-my />
  </div>
</template>

<script setup>
import HeaderLogo from './header-logo.vue'
import HeaderTheme from './header-theme.vue'
import HeaderMy from './header-my.vue'
import Hint from './hint.vue'
import { ref } from 'vue'
const keywords = ref('')
const onConfirm = (...v) => {
  // console.log(v)
}
const onInput = (...v) => {
  // console.log(v)
}
const itemClick = (v) => {
  keywords.value = v
}
</script>
