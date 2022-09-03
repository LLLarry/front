<template>
  <Pins :id="route.params.id" />
</template>

<script setup>
import Pins from './components/pins.vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
</script>

<style></style>
