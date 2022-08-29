<template>
  <div class="w-full">
    <infinite-list
      v-model="loading"
      :isFinished="isFinished"
      @onLoad="getPexelsData"
      :ref="getInfiniteListInstance"
    >
      <water-fall
        :data="pexels"
        :column="isMoboleTerminal ? 2 : 5"
        :gaps="20"
        :isPicturePreReading="false"
      >
        <template v-slot="{ item, width }">
          <list-item :pexel="item" :width="width" />
        </template>
      </water-fall>
    </infinite-list>
  </div>
</template>

<script setup>
import ListItem from './item/index.vue'
import { getPexels } from '@/api/pexels'
import { isMoboleTerminal } from '@/utils/flexible'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const pexels = ref([])
// 是否正在加载中
const loading = ref(false)
// 数据是否已全部加载完毕
const isFinished = ref(false)
const infiniteListInstance = ref(null)
const getInfiniteListInstance = (el) => {
  console.log(el)
  infiniteListInstance.value = el
}

let params = {
  page: 1,
  size: 20,
  categoryId: ''
}
const getPexelsData = async () => {
  try {
    // 判断数据pexels是否为空？ 为空 page = 1; 不为空 page++
    if (pexels.value.length === 0) {
      params.page = 1
    } else {
      params.page++
    }
    const { list } = await getPexels(params)
    // 判断数据pexels是否为空？ pexels.value = list 否则 pexels.value.push(list)
    if (pexels.value.length === 0) {
      pexels.value = list
    } else {
      pexels.value.push(...list)
    }

    // 判断是否还有数据
    if (list.length !== params.size) {
      isFinished.value = true
    }
    // 将加载状态设置为false
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const initParams = (newCategory) => {
  ;(params = {
    ...params,
    page: 1,
    categoryId: newCategory.id
  }),
    (pexels.value = [])
  isFinished.value = false
  infiniteListInstance.value.init()
}

watch(
  () => store.getters.currentCategory,
  (newCategory) => {
    initParams(newCategory)
  }
)

// 监听数据
// watch(
//   () => isMoboleTerminal.value,
//   (va) => {
//     pexels.value = pexels.value.map((pexel) => {
//       const { _style, ...item } = pexel
//       return { ...item }
//     })
//   }
// )
</script>

<style></style>
