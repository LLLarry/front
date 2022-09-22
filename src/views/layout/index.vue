<template>
  <div>
    <Header v-if="!isMoboleTerminal" />
    <Main />
    <Floating v-if="!isMoboleTerminal" />
  </div>
</template>

<script setup>
import Header from './components/header/index.vue'
import Main from './components/main/index.vue'
import Floating from './components/floating/index.vue'
import { isMoboleTerminal } from '@/utils/flexible'
</script>
