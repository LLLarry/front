<template>
  <div>
    <div
      class="flex items-center mt-4 border-2 rounded mx-2 justify-center font-semibold dark:bg-[#614f35] dark:border-[#423b35] bg-[#FCEEDB] text-red-500 border-[#E5D2C3] py-1 px-2 text-xs"
    >
      <span
        >限时特惠|距离优惠结束仅剩
        <count-down :time="100000">
          <template v-slot="{ data }">
            <span>{{ data.timeStr }}</span>
          </template>
        </count-down></span
      >
    </div>

    <div class="text-center text-base mt-4">
      支付金额：<span class="text-red-500"
        >&yen;
        <span class="text-[30px] font-bold">{{
          selectMenuItem.price
        }}</span></span
      >
    </div>

    <div class="flex justify-center mt-4">
      <Button
        type="default"
        class="dark:bg-zinc-900 duration-300 dark:border-zinc-600"
        ><svg-icon name="zhi-fu-bao" class="w-3 h-3 mr-1"></svg-icon
        ><span class="text-[20px] dark:text-zinc-500">支付宝</span></Button
      >
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectMenuItem: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style></style>
