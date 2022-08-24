<template>
  <ul
    class="relative z-10 text-xs bg-white flex overflow-auto p-1 text-zinc-600 pr-6"
    ref="ulEle"
  >
    <li
      class="absolute top-1 h-[22.5px] bg-zinc-900 rounded-lg duration-200 z-10"
      :style="sliderStyle"
    ></li>
    <li
      v-for="(category, index) in categorys"
      :key="category.id"
      class="shrink-0 px-1.5 py-0.5 z-10"
      :class="{ 'text-zinc-50': index === curretIndex }"
      @click="handleSelectCategory(index)"
      :ref="storeLiEle"
    >
      {{ category.name }}
    </li>
    <li class="shrink-0 px-1.5 py-0.5 z-10">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </li>
    <li
      class="px-1 w-4 h-4 fixed top-0 bottom-0 right-[-2px] z-20 shadow-l-white bg-white"
    >
      <svg-icon
        name="hamburger"
        @click="visible = true"
        class="px-1 w-4 h-4 fixed top-0 right-[-2px] z-20 shadow-l-white bg-white"
      />
    </li>
  </ul>
  <popup v-model="visible" class="aaa" style="color: red">
    <Menu :categorys="data" @handleSelectCategory="handleSelectCategory" />
  </popup>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { useScroll } from '@vueuse/core'
import Menu from '@/views/main/components/menu/index.vue'
import { scrollTransition } from '@/utils'
import { useStore } from 'vuex'
const store = useStore()
const run = scrollTransition()

// 默认选中索引
const curretIndex = ref(-1)
const sliderStyle = ref({
  left: '10px',
  width: '0px',
  bottom: 0
})
//  ul dom元素
const ulEle = ref(null)
// li dom元素容器
const liEles = ref(new Set())
// 每一项在屏幕中央时，需要向左滚动的距离
const scrollRaces = ref([])

// ulScrollLeft 向左滚动的距离
const { x: ulScrollLeft } = useScroll(ulEle)

const visible = ref(false)

const categorys = computed(() => store.getters.categorys)

// 选中索引
const handleSelectCategory = (index) => {
  curretIndex.value = index
  visible.value = false
  // ulEle.value.scrollTo(scrollRaces.value[index], 0)
  run({
    el: ulEle.value,
    position: scrollRaces.value[index],
    direction: 'l',
    time: 200
  })
}
// 获取v-for遍历的子元素dom节点时，需要使用回调函数获取; 注意: 每次页面更新之后storeLiEle，都会重新执行一遍，这样会导致liEles中存储的都是重复的元素
// 所以可以使用Set来存储数据，避免存入重复的数据， 也可以在obBeforeUpdate前设置liEles.value的值为初始化值
const storeLiEle = (el) => {
  liEles.value.add(el)
}

watch(
  curretIndex,
  (newIndex, oldIndex) => {
    // 保证渲染之后再进行计算元素的位置
    nextTick(() => {
      // 获取点击元素的距离左边屏幕的距离和元素的宽度
      const liEle = Array.from(liEles.value)[newIndex]
      if (!liEle) return false
      const { left, width, height } = liEle.getBoundingClientRect()
      sliderStyle.value = {
        left: `${left + ulScrollLeft.value}px`,
        width: `${width}px`,
        height: `${height}px`
      }
    })
  },
  {
    immediate: true
  }
)

// 监听data初次数据渲染之后，将slider条设置到第一项
watch(
  categorys,
  (cgs) => {
    nextTick(() => {
      if (cgs.length <= 0) return
      curretIndex.value = 0
      // 获取1/2屏幕的宽度
      const halfScreenWidth = window.innerWidth / 2
      // 每一项向左滚动的距离 = 每一项距离屏幕左边的距离 - 1/2屏幕的宽度 + 1/2自身的宽度
      scrollRaces.value = Array.from(liEles.value).map(
        (el) =>
          el.getBoundingClientRect().left - halfScreenWidth + el.offsetWidth / 2
      )
    })
  },
  {
    immediate: true
  }
)
</script>
