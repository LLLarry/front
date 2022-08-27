<template>
  <div class="w-full h-full overflow-auto">
    <!-- 展示列表内容插槽 -->
    <slot />
    <!-- 底部 ---加载中插槽 -->
    <div ref="infiniteLoadEle">
      <slot name="loading" v-if="!isFinished && modelValue">
        <div class="py-1">
          <svg-icon
            name="infinite-load"
            class="w-3 h-3 block mx-auto animate-spin fill-zinc-500"
          />
        </div>
      </slot>
    </div>

    <!-- 底部 ---数据已全部加载完毕 -->
    <slot name="finished" v-if="isFinished">
      <div class="py-3">
        <div class="text-sm text-zinc-700 mx-auto text-center">
          暂无更多数据
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import useIntersectionObserver from './useIntersectionObserver'
const props = defineProps({
  modelValue: {
    // 当前是否处于加载状态
    type: Boolean,
    required: true
  },
  isFinished: {
    // 数据是否全部加载完成
    type: Boolean,
    required: true
  }
})
const emits = defineEmits(['update:modelValue', 'onLoad'])
// loading元素
const infiniteLoadEle = ref(null)
const isIntersectingRef = ref(false)
// 判断元素在 可视区域内或区域外相互切换时会触发回调
useIntersectionObserver(infiniteLoadEle, ({ isIntersecting }) => {
  // isIntersecting 表示元素是在可视范围内
  // 触发onLoad条件 isIntersecting 为true; modelValue为false; isFinished为false
  isIntersectingRef.value = isIntersecting
  judgeAndEmit()
})

//判断条件并且触发onLoad
function judgeAndEmit() {
  if (isIntersectingRef.value && !props.modelValue && !props.isFinished) {
    // 修改状态为正在加载中
    emits('update:modelValue', true)
    emits('onLoad') // 触发加载
  }
}

watch(
  () => props.modelValue,
  async (v) => {
    if (v) return false
    await nextTick()
    judgeAndEmit()
  }
)
</script>

<style></style>
