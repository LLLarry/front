<template>
  <div
    class="w-full h-screen bg-zinc-200 dark:bg-zinc-800 duration-300 overflow-hidden"
  >
    <div
      class="w-full xl:mt-2 overflow-auto xl:max-w-sm mx-auto xl:rounded text-zinc-700 dark:text-zinc-200 duration-300 text-sm"
    >
      <!-- 核心区域 -->
      <div class="dark:bg-zinc-900 bg-white pb-5">
        <navbar v-if="isMoboleTerminal">精选会员</navbar>
        <!-- 头部 -->
        <div class="px-2 pt-3 pb-1">
          <h1 class="text-center text-[30px] font-bold text-[#be9c63]">
            精选VIP
          </h1>
          <h3 class="text-center text-[18px] mt-2 text-[#D5B566]">
            升级精选VIP，畅想所有内容
          </h3>
        </div>
        <!-- menu -->

        <div class="flex py-2 px-2 w-full overflow-x-auto">
          <pay-menu-item
            class="mr-2"
            v-for="one in payList"
            :key="one.id"
            :data="one"
            :selectMenuItem="selectMenuItem"
            @click="selectMenuItem = one"
          />
        </div>

        <!-- tip -->
        <p
          class="text-zinc-700 dark:text-zinc-500 mt-2 text-sm px-2"
          v-show="selectMenuItem.desc"
        >
          {{ selectMenuItem.desc }}
        </p>

        <!-- pc端支付 -->
        <pc-pay :selectMenuItem="selectMenuItem" v-show="!isMoboleTerminal" />
      </div>
      <!-- 底部 -->
      <mobile-pay :selectMenuItem="selectMenuItem" v-show="isMoboleTerminal" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<script setup>
import { getVipPayList } from '@/api/pay'
import { isMoboleTerminal } from '@/utils/flexible'
import PayMenuItem from './components/pay-menu-item/index.vue'
import PcPay from './components/pc-pay/index.vue'
import MobilePay from './components/mobile-pay/index.vue'
import { computed, ref } from 'vue'
const payList = ref([])
const selectMenuItem = ref({})

const getVipPayListFn = async () => {
  const res = await getVipPayList()
  payList.value = res
  selectMenuItem.value = res[0]
}
getVipPayListFn()
</script>

<style></style>
