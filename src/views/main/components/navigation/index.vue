<template>
  <navigation-mobile v-if="isMoboleTerminal" />
  <navigation-pc v-else />
</template>

<script setup>
import NavigationMobile from './mobile/index.vue'
import NavigationPc from './pc/index.vue'
import { isMoboleTerminal } from '@/utils/flexible'
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('categorys/getCategorysData')
</script>

<style></style>
