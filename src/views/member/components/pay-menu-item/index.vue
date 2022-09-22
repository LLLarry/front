<template>
  <div
    class="inline-block flex-shrink-0 relative cursor-pointer last:mr-0 text-[0px] rounded border border-zinc-300 py-2 px-4 text-[#7F5121] dark:border-zinc-500 bg-white dark:bg-zinc-800 duration-300"
    :class="{ active: isActive }"
  >
    <div class="text-center text-base title">{{ data.title }}</div>
    <div class="font-bold text-center mt-2">
      <span class="text-base">&yen; </span>
      <span class="text-[35px]">{{ data.price }}</span>
    </div>

    <div class="text-sm text-center mt-2 line-through text-[#D5B869]">
      <span class="text-sm">&yen;</span><span>{{ data.oldPrice }}</span>
    </div>
    <div
      class="text-xs py-0.5 px-1.5 rounded-tr rounded-bl text-[#7F5121] hot-box absolute top-[-10px] right-[-1px]"
      v-show="isHot"
    >
      热销
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  selectMenuItem: {
    type: Object,
    default: () => ({})
  }
})
const isHot = computed(() => props.data.isHot)
const isActive = computed(() => props.selectMenuItem.id === props.data.id)
</script>

<style lang="scss" scoped>
.title {
  letter-spacing: 2px;
}
.active {
  border-color: #ddba93;
  background-color: #fcf7ec;
}
.hot-box {
  background-image: linear-gradient(to right, #f2be83, #f9ead6);
}
</style>
