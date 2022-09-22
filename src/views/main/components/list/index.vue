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
          <list-item :pexel="item" :width="width" @selectItem="selectItem" />
        </template>
      </water-fall>
    </infinite-list>
  </div>
  <!-- 图片详情 -->
  <transition
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <Pins :id="currentItem.id" v-if="pinsVisible" />
  </transition>
</template>

<script setup>
import ListItem from './item/index.vue'
import { getPexels } from '@/api/pexels'
import { isMoboleTerminal } from '@/utils/flexible'
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import Pins from '@/views/pins/components/pins.vue'
import gsap from 'gsap'
import { useEventListener } from '@vueuse/core'

const store = useStore()
const pexels = ref([])
// 是否正在加载中
const loading = ref(false)
// 数据是否已全部加载完毕
const isFinished = ref(false)
const infiniteListInstance = ref(null)
const getInfiniteListInstance = (el) => {
  infiniteListInstance.value = el
}
const searchText = computed(() => store.getters.searchText)

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

const initParams = (newCategory, searchText) => {
  ;(params = {
    ...params,
    page: 1,
    categoryId: newCategory.id,
    searchText
  }),
    (pexels.value = [])
  isFinished.value = false
  infiniteListInstance.value.init()
}

// 同时监听分类页的改变，和搜索内容的改变
watch(
  [() => store.getters.currentCategory, searchText],
  ([newCategory, st]) => {
    initParams(newCategory, st)
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
// 选中的item信息
const currentItem = ref({})
// 选中item
const selectItem = (item) => {
  currentItem.value = item
  // 修改页面地址
  window.history.pushState(null, '', '/pins/' + item.id)
}
// 监听页面回退
useEventListener('popstate', () => {
  delete currentItem.value.id
})
const pinsVisible = computed(() => currentItem.value.id !== void 0)
// pins动画钩子 -- 动画执行之前
const onBeforeEnter = (el) => {
  gsap.set(el, {
    scaleX: 0.2,
    scaleY: 0.2,
    transformOrigin: '0 0',
    translateX: currentItem.value.translateX,
    translateY: currentItem.value.translateY,
    opacity: 0
  })
}

// pins动画钩子 -- 动画执行过程
const onEnter = (el, done) => {
  el.__gsap__ = gsap.to(el, {
    duration: 0.4,
    scaleX: 1,
    scaleY: 1,
    transformOrigin: '0 0',
    translateX: 0,
    translateY: 0,
    opacity: 1,
    onComplete: done
  })
}

// pins动画钩子 -- 动画离开过程
const onLeave = (el, done) => {
  el.__gsap__.reverse()
  setTimeout(() => {
    done()
  }, el.__gsap__._dur * 1500)
}

const onAfterLeave = (el) => {
  currentItem.value = {}
}

// const onEnter = (el, done) => {
//   el.__gsap__ = gsap.to(el, {
//     duration: 0.3999,
//     scaleX: 1,
//     scaleY: 1,
//     translateX: 0,
//     translateY: 0,
//     opacity: 1,
//     onComplete: done
//   })
// }

// const onBeforeLeave = () => {}
// // pins动画钩子 -- 动画离开过程
// const onLeave = (el, done) => {
//   el.__gsap__.reverse()
//   setTimeout(() => {
//     done()
//   }, el.__gsap__._dur * 1500)
// }

// const onAfterLeave = (el) => {
//   currentItem.value = {}
// }
</script>

<style></style>
