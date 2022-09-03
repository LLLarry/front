<template>
    <div  class="w-screen h-[400px] flex items-center justify-center">
      <div ref="testGsap" class="border border-zinc-300 rounded-sm p-4">test GSAP</div>
    </div>
    <Button @click="handleStart">执行动画</Button>
    <Button @click="handleReverse">翻转动画</Button>
</template>

<script setup>
import gsap from "gsap"
import { onMounted, ref } from 'vue'
const testGsap = ref(null)
let tween
onMounted(() => {
  gsap.set(testGsap.value, { transform: 'translateX(-100px)', color: 'blue' })
  tween = gsap.to(testGsap.value, { transform: 'translateX(100px)', color: 'pink', duration: 1, delay: 0 })
  // tween.pause();
})
const handleStart = () => {
   tween.play()
}
const handleReverse = () => {
   tween.reverse()
}
</script>

<style>

</style>