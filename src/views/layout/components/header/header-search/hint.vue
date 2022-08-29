<template>
  <div>
    <div
      class="py-1 cursor-pointer rounded-sm px-1 text-zinc-500 text-sm font-bold bg-white hover:bg-zinc-300 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-900 duration-500"
      v-for="(item, index) in fmtList"
      :key="index"
      @click="handleSelect(list[index])"
      v-html="item"
    ></div>
  </div>
</template>

<script>
const EMITS_ITEM_CLICK = 'item-click'
</script>

<script setup>
import { computed, ref, watch } from 'vue'
import { getPexelsHint } from '@/api/pexels'
import { debounce } from '@/utils'

const props = defineProps({
  searchText: {
    type: String,
    required: true
  }
})
const emits = defineEmits([EMITS_ITEM_CLICK])
const list = ref([])

// 防抖搜索函数
const searchDebounce = debounce(async (q) => {
  const { result } = await getPexelsHint({ q })
  list.value = result
}, 300)

// 监听搜索值得改变后就开始搜索
watch(() => props.searchText, searchDebounce, {
  immediate: true
})

const handleSelect = (item) => {
  emits(EMITS_ITEM_CLICK, item)
}

const fmtList = computed(() => {
  const reg = new RegExp(`(${props.searchText})`, 'g')
  return list.value.map((item) =>
    item.replace(reg, '<span class="text-black dark:text-white">$1</span>')
  )
})
</script>

<style></style>
