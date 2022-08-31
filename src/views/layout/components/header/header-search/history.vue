<template>
  <div>
    <div class="flex items-center">
      <div class="text-zinc-400 text-sm">最近搜索</div>
      <div class="cursor-pointer ml-2">
        <svg-icon
          name="delete"
          class="w-1.5 h-1.5"
          color="#888888"
          @click="onClickDelectAll"
        />
      </div>
    </div>

    <div class="flex flex-wrap mt-1" v-if="historys.length > 0">
      <div
        class="py-1 px-1.5 rounded-sm bg-zinc-100 mr-2 mb-1 flex items-center font-semibold cursor-pointer hover:bg-zinc-200 dark:bg-zinc-600 hover:dark:bg-zinc-700 dark:text-zinc-400 duration-500"
        v-for="(history, index) in historys"
        :key="history"
        @click.stop="onClickItem(history)"
      >
        <span class="text-sm">{{ history }}</span>
        <div class="ml-1">
          <svg-icon
            name="input-delete"
            class="w-1.5 h-1.5 hover:dark:fill-zinc-200 duration-500"
            @click.stop="onClickDeleteItem(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import confirm from '@/libs/confirm/index'
const emits = defineEmits(['itemClick'])
const historys = computed(() => store.getters.historys)
const store = useStore()
// 点击删除所有
const onClickDelectAll = () => {
  confirm({
    title: '提示',
    content: '确认删除全部历史记录吗？',
    cancelText: '不删了',
    okText: '全部删掉'
  })
    .then((res) => {
      store.commit('search/removeAllHistory')
      console.log(res)
    })
    .catch((e) => {
      console.log(e)
    })
}
// 点击历史项
const onClickItem = (history) => {
  // 搜索历史
  emits('itemClick', history)
}
// 点击删除单项
const onClickDeleteItem = (history) => {
  store.commit('search/removeHistory', history)
}
</script>

<style></style>
