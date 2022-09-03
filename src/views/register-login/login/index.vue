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
      <!-- 账号登录 -->
      <div
        class="text-red-600 font-semibold text-center dark:text-zinc-500 hidden xl:block text-sm"
      >
        账号登录
      </div>
      <!-- 登录表单 -->
      <vee-form class="w-full mt-4">
        <vee-filed
          name="name"
          :rules="validateName"
          placeholder="用户名"
          type="text"
          class="border-b block w-full bg-transparent dark:border-zinc-500 dark:text-zinc-300 border-zinc-300 font-bold duration-500 text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 mb-3 focus:border-red-600"
        />
        <vee-error-message name="password" class="text-sm text-red-600" />
        <vee-filed
          name="password"
          :rules="validatePassword"
          placeholder="密码"
          type="password"
          class="border-b block w-full bg-transparent dark:border-zinc-500 dark:text-zinc-300 border-zinc-300 font-bold text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 mb-3 focus:border-red-600"
        />
        <vee-error-message name="password" class="text-sm text-red-600" />
        <Button
          class="bg-red-600 mt-4 border-red-600 w-full hover:bg-red-600 focus:bg-red-600 hover:border-red-700 focus:border-red-700 active:border-red-700 duration-300 dark:bg-zinc-900 dark:border-zinc-900 xl:dark:bg-zinc-800 xl:dark:border-zinc-800 py-1"
          >登录</Button
        >
      </vee-form>

      <div class="mt-10">
        <div class="flex justify-around">
          <svg-icon
            class="w-4 h-4 fill-zinc-200 dark:fill-zinc-300 duration-500 cursor-pointer"
            name="qq"
          ></svg-icon>

          <svg-icon
            class="w-4 h-4 fill-zinc-200 dark:fill-zinc-300 duration-500 cursor-pointer"
            name="wexin"
          ></svg-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Form as VeeForm,
  Field as VeeFiled,
  ErrorMessage as VeeErrorMessage
} from 'vee-validate'
import { validateName, validatePassword } from '../validate'
</script>

<style></style>
