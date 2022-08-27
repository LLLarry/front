<template>
  <div class="ml-2 flex items-center">
    <Button
      icon="profile"
      type="danger"
      class="w-4 h-4 rounded-sm"
      v-if="false"
    />
    <popover trigger="hover" placement="bottom-end">
      <template #reference>
        <div class="flex items-center">
          <img
            v-lazy
            src="https://m.imooc.com/static/wap/static/common/img/logo-small@2x.png"
            class="w-4 h-4 rounded-sm"
            alt=""
          />
          <svg-icon
            name="down-arrow"
            class="w-1.5 h-1.5 ml-0.5 fill-zinc-500"
          />
        </div>
      </template>

      <!-- 菜單 -->
      <div
        class="text-sm cursor-pointer w-[140px] overflow-hidden text-zinc-600 dark:bg-zinc-800"
      >
        <div
          v-for="menu in menus"
          :key="menu.id"
          class="flex items-center p-1 hover:bg-zinc-100/60 duration-300 dark:hover:bg-zinc-700 dark:text-zinc-300"
        >
          <svg-icon
            :name="menu.icon"
            class="w-1.5 h-1.5 mr-1 fill-zinc-600 dark:fill-zinc-300"
          />
          <div>{{ menu.title }}</div>
        </div>
      </div>
    </popover>
  </div>
</template>

<script setup>
const menus = [
  {
    id: 0,
    title: '个人资料',
    icon: 'profile',
    path: '/profile'
  },
  {
    id: 1,
    title: '升级 VIP',
    icon: 'vip-profile',
    path: '/member'
  },
  {
    id: 2,
    title: '退出登录',
    icon: 'logout',
    path: ''
  }
]
</script>

<style></style>
