<template>
  <div class="h-header flex items-center px-2">
    <header-logo />
    <search v-model="keywords" @confirm="onConfirm" @input="onInput" />
    <header-theme />
    <header-my />
  </div>
</template>

<script setup>
import HeaderLogo from './header-logo.vue'
import HeaderTheme from './header-theme.vue'
import HeaderMy from './header-my.vue'
import { ref } from 'vue'
const keywords = ref('')
const onConfirm = (...v) => {
  // console.log(v)
}
const onInput = (...v) => {
  // console.log(v)
}
</script>
