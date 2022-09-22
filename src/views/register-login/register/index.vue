<template>
  <div
    class="w-screen h-screen xl:bg-zinc-200 dark:bg-zinc-800 duration-500 bg-white"
  >
    <!-- pc端头部 -->
    <div class="py-4 justify-center hidden xl:flex">
      <img src="https://res.lgdsunday.club/signlogo.png" alt="" />
    </div>
    <!-- 移动端头部 -->
    <div class="flex justify-center h-[111px] relative xl:hidden">
      <!-- 背景图 -->
      <img
        src="https://res.lgdsunday.club/login-bg.png"
        class="w-full h-full object-fill dark:hidden"
        alt=""
      />
      <!-- 前景图 -->
      <img
        class="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-4 h-4"
        src="https://m.imooc.com/static/wap/static/common/img/logo-small@2x.png"
        alt=""
      />
    </div>

    <!-- login 核心区域 -->

    <div
      class="xl:w-[380px] w-full bg-white dark:bg-zinc-800 xl:dark:bg-zinc-900 duration-500 mt-4 xl:shadow-sm px-3 py-3 xl:rounded-sm mx-auto"
    >
      <!-- 账号注册 -->
      <div
        class="text-red-600 font-semibold text-center dark:text-zinc-500 hidden xl:block text-sm"
      >
        账号注册
      </div>
      <!-- 注册表单 -->
      <vee-form class="w-full mt-4 text-[0px]" @submit="onSubmit">
        <vee-filed
          v-model="inputValues.username"
          name="username"
          :rules="validateName"
          placeholder="用户名"
          type="text"
          class="border-b block w-full bg-transparent dark:border-zinc-500 dark:text-zinc-300 border-zinc-300 font-bold duration-500 text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 focus:border-red-600"
        />
        <vee-error-message
          name="username"
          class="text-sm text-red-600 mt-0.5 block"
        />
        <vee-filed
          v-model="inputValues.password"
          name="password"
          :rules="validatePassword"
          placeholder="密码"
          type="password"
          class="border-b block w-full bg-transparent dark:border-zinc-500 mt-3 dark:text-zinc-300 border-zinc-300 font-bold text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 focus:border-red-600"
        />
        <vee-error-message
          name="password"
          class="text-sm text-red-600 mt-0.5 block"
        />

        <vee-filed
          v-model="inputValues.confirmPassword"
          name="confirmPassword"
          rules="validateComfirmPassword:@password"
          placeholder="确认密码"
          type="password"
          class="border-b block w-full bg-transparent dark:border-zinc-500 mt-3 dark:text-zinc-300 border-zinc-300 font-bold text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 focus:border-red-600"
        />
        <vee-error-message
          name="confirmPassword"
          class="text-sm text-red-600 mt-0.5 block"
        />

        <div class="text-right">
          <router-link
            to="/login"
            tag="a"
            class="hover:text-red-600 select-none no-underline text-zinc-500 dark:text-zinc-400 duration-500 cursor-pointer text-xs mt-3 inline-block"
            >去登录</router-link
          >
        </div>
        <Button
          class="bg-red-600 mt-4 border-red-600 w-full hover:bg-red-600 focus:bg-red-600 hover:border-red-700 focus:border-red-700 active:border-red-700 duration-300 dark:bg-zinc-900 dark:border-zinc-900 xl:dark:bg-zinc-800 xl:dark:border-zinc-800 py-1"
          :loading="loading"
          >立即注册</Button
        >
      </vee-form>
    </div>

    <!-- 引入人类行为认证组件 -->
    <transition name="up">
      <slider-captcha-vue
        v-if="sliderCaptchaVisible"
        @success="onSuccess"
        @close="onClose"
      />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'login'
}
</script>
<script setup>
import {
  Form as VeeForm,
  Field as VeeFiled,
  ErrorMessage as VeeErrorMessage,
  defineRule
} from 'vee-validate'
import {
  validateName,
  validatePassword,
  validateComfirmPassword
} from '../validate'
import SliderCaptchaVue from '../components/slider-captcha/index.vue'
import { getCaptcha } from '@/api/sys'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()
const inputValues = ref({})
const loading = ref(false)
// 人类行为认证组件是否展示
const sliderCaptchaVisible = ref(false)

// 插入规则
defineRule('validateComfirmPassword', validateComfirmPassword)

const onSubmit = (v) => {
  sliderCaptchaVisible.value = true
}

const onSuccess = async (arr) => {
  try {
    loading.value = true
    // 向后台发送请求验证人类行为认证
    const flag = await getCaptcha({
      behavior: arr
    })

    if (!flag) return false
    const { confirmPassword, ...v } = inputValues.value
    // 在这里发送登录请求
    await store.dispatch('user/handleRegister', {
      ...v,
      ...route.query
    })
  } finally {
    loading.value = false
  }
}
const onClose = () => {
  sliderCaptchaVisible.value = false
}
</script>

<style lang="scss" scoped>
.up-enter-from,
.up-leave-to {
  transform: translateY(50px);
  opacity: 0;
}
.up-enter-active,
.up-leave-active {
  transition: all 0.3s ease-in-out;
}
</style>
