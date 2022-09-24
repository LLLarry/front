<template>
  <div
    class="w-full h-screen bg-zinc-200 dark:bg-zinc-800 duration-300 overflow-hidden"
  >
    <navbar v-if="isMoboleTerminal">支付结果</navbar>
    <div
      class="w-full xl:mt-2 overflow-auto xl:max-w-sm mx-auto xl:rounded text-zinc-700 dark:text-zinc-200 duration-300 text-sm"
    >
      <div class="p-8 bg-white dark:bg-zinc-900">
        <div class="flex flex-col items-center justify-center">
          <!-- 支付成功 -->
          <h1
            class="mb-4 flex items-center text-[25px] text-green-700"
            v-if="isSuccess"
          >
            <svg-icon name="pay-success" class="w-4 h-4 mr-2"></svg-icon>
            支付成功
          </h1>

          <!-- 支付失败 -->
          <h1 class="mb-4 flex items-center text-[25px] text-red-700" v-else>
            <svg-icon name="pay-fail" class="w-4 h-4 mr-2"></svg-icon>
            支付失败
          </h1>
          <Button
            type="primary"
            size="middle"
            class="w-[100px]"
            @click="handleConfirm"
            >确定</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { isMoboleTerminal } from '@/utils/flexible'
import {  getProfile } from '@/api/sys'
import {  alipayResult } from '@/api/pay'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
const store = useStore()
const router = useRouter()
const route = useRoute()
const isSuccess = ref(false)
// 获取页面中携带的订单号、拿到订单号向后台请求看看是否支付成功？
const getPayStatus = async () => {
  const out_trade_no = route.query.out_trade_no
  isSuccess.value = await alipayResult(out_trade_no)
}
getPayStatus()
// 重新获取用户信息，并跳转到首页
const handleConfirm = () => {
  const userInfo = await getProfile()
  store.commit('user/setUserInfo', userInfo)
  router.push('/')
}
</script>

<style></style>
