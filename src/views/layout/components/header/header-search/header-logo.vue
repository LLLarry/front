<template>
  <div class="mr-2 cursor-pointer" @click="handleGoHome">
    <h1 class="hidden">前后台解决方案</h1>
    <img
      src="https://m.imooc.com/static/wap/static/common/img/logo-small@2x.png"
      alt="logo"
      class="w-4 h-4"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const handleGoHome = () => {
  router.push('/')
}
</script>

<style></style>
