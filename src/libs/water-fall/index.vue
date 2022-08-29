<template>
  <div
    ref="waterFallRoot"
    :style="{ height: `${rootHeight}px` }"
    class="relative overflow-hidden"
  >
    <!-- 只有列宽计算出来、并且data所有数据才展示数据 -->
    <template v-if="columnWidth && data.length > 0">
      <div
        class="__water-fall-item__ absolute duration-300 left-[-99999px]"
        v-for="(item, index) in data"
        :key="nodeKey ? item[nodeKey] : index"
        :style="{
          top: item._style?.top + 'px',
          left: item._style?.left + 'px',
          width: item._style?.width + 'px'
        }"
      >
        <div>{{ data._style }}</div>
        <slot :item="item" :width="columnWidth" />
      </div>
    </template>
  </div>
</template>

<script setup>
// 瀑布流通用組件

import { nextTick, watch } from 'vue'
import { useInit } from './useInit'
import { waitAllImgCompile, useImageHeights } from './usePicture'
import useLocation from './useLocation'
let timer = null

/**
 * 1、通过父组件的宽度、列数、间距计算出 每一列的left的值 columLefts
 * 2、创建一个数组记录每一列的高度 columHeights
 * 3、拿到传过来的数据进行依次渲染到 columHeights 高度最小的那一列，并且将新添加的元素添的高度添加到指定列的高度上
 */
const props = defineProps({
  data: {
    // 默认数据源
    type: Array,
    required: true,
    default: () => []
  },
  column: {
    // 渲染几列
    type: Number,
    default: 1
  },
  nodeKey: {
    // 唯一key
    type: String
  },
  gaps: {
    // [横向间距、纵向间距]
    type: [Number, Array],
    default: () => [10, 10]
  },
  isPicturePreReading: {
    // 是否需要等待图片预加载 （ false时， 每一项要有photoHeight、photoWidth）
    type: Boolean,
    default: true
  }
})

const {
  columnLefts,
  columnWidth,
  waterFallRoot,
  fmtGaps,
  columnHeights,
  rootHeight,
  init
} = useInit(props)

watch(
  () => props.data,
  async (newData) => {
    await nextTick()
    if (newData.length <= 0) {
      init()
    }
    // 执行初始化数据，执行之后useInit的返回值为最新的数据
    if (props.isPicturePreReading) {
      // 等待与所有图片渲染完毕
      const itemHeights = waitAllImgCompile()
      // 有可能图片还没加载完成就有更新数据，可能会导致计算高度出错的情况，所以我们加上延时操作2
      timer = setTimeout(() => {
        if (itemHeights.value.length === newData.length) {
          clearTimeout(timer)
          useLocation({
            columnLefts,
            itemHeights,
            columnWidth,
            columnHeights,
            rootHeight,
            fmtGaps,
            props
          })
        }
      }, 50)
    } else {
      // 不需要预渲染
      const itemHeights = useImageHeights()
      // 动态设置每个元素的位置
      useLocation({
        columnLefts,
        itemHeights,
        columnWidth,
        columnHeights,
        rootHeight,
        fmtGaps,
        props
      })
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 监听props.column的改变，重新初始化数据
watch(
  () => props.column,
  async (v) => {
    // 此时子组件还没有挂载到页面上、所以在init的dom操作并不能执行、所以需要在渲染之后执行init才做
    await nextTick()
    // 当检测到列变化后，将data中的_style删除掉，会触发重新渲染，进而触发重新布局
    props.data.forEach((item) => {
      delete item._style
    })
    init()
  },
  {
    immediate: true
  }
)
</script>

<style></style>
