<template>
  <div class="fixed left-0 bottom-0 right-0 mobile-pay">
    <div
      class="flex items-center justify-center font-semibold bg-[#FCEEDB] dark:bg-[#614f35] dark:border-[#423b35] text-red-500 border-t-2 border-[#E5D2C3] py-1 px-2 text-xs"
    >
      <span
        >限时特惠|距离优惠结束仅剩
        <span class="relative"
          ><count-down :time="100000">
            <template v-slot="{ data }">
              <span>{{ data.timeStr }}</span>
            </template>
          </count-down></span
        ></span
      >
    </div>
    <div
      class="flex justify-between items-center px-2 py-1 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 duration-300"
    >
      <div>
        <div>
          券后合计：<span class="text-red-500"
            >&yen;<span class="text-lg font-bold">{{
              selectMenuItem.price
            }}</span></span
          >
        </div>
        <div class="text-red-500">
          优惠券：限时立减 &yen; {{ discountMoney }}
        </div>
      </div>
      <Button
        class="bg-red-600 px-4 border-red-600 hover:bg-red-600 focus:bg-red-600 hover:border-red-700 focus:border-red-700 active:border-red-700 duration-300 dark:bg-zinc-800 dark:border-zinc-900 xl:dark:bg-zinc-800 xl:dark:border-zinc-800 py-1"
        @click="handlePayBtn"
        >立即开通</Button
      >
    </div>
    <popup v-model="visible">
      <div class="py-3 h-[70vh]">
        <h3 class="font-semibold text-base mb-2 px-2">请选择支付方式</h3>
        <ul class="px-1">
          <li
            class="flex items-center border-b border-zinc-300 py-1 active:bg-zinc-100 px-1 duration-300"
            @click="handlePay('zhifubao')"
          >
            <svg-icon name="zhi-fu-bao" class="w-4 h-4" />
            <div class="ml-1 text-base text-zinc-700">支付宝</div>
          </li>
        </ul>
      </div>
    </popup>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { alipay } from '@/api/pay'
const props = defineProps({
  selectMenuItem: {
    type: Object,
    default: () => ({})
  }
})

const visible = ref(false)

// 优惠金额
const discountMoney = computed(() => {
  if (Object.keys(props.selectMenuItem).length <= 0) return 0
  return (
    (props.selectMenuItem.oldPrice * 10000 -
      props.selectMenuItem.price * 10000) /
    10000
  )
})
const handlePayBtn = () => {
  visible.value = true
}
const handlePay = async (type) => {
  visible.value = false
  // 支付宝下单
  const { title, desc } = props.selectMenuItem

  // 获取支付页面地址
  const { encodeURI } = await alipay(title, 0.01, desc, false)
  // https://excashier.alipay.com/standard/auth.htm?payOrderId=67ecd10be8c944e38e722017d29cab6b.55#
  window.location.href = decodeURIComponent(encodeURI)
}
</script>

<style lang="scss" scoped>
.mobile-pay {
  /* 底部安全区 */
  /* bottom: env(safe-area-inset-bottom);
  bottom: constant(safe-area-inset-bottom); */
}
</style>
