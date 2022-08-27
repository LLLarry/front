<template>
  <div ref="popoverRoot" class="select-none inline-flex" @click.stop>
    <slot name="reference" />
  </div>
  <Teleport to="body">
    <transition name="popover-tip">
      <div
        v-if="tipVisible"
        ref="tipRoot"
        class="fixed shadow-lg p-1 rounded-sm border border-zinc-100 z-20 bg-white dark:bg-zinc-800 dark:border-zinc-900"
        :style="tipStyle"
        @click.stop
      >
        <slot />
      </div>
    </transition>
  </Teleport>
</template>

<script>
const PLACEMENTS = [
  'bottom',
  'bottom-start',
  'bottom-end',
  'top',
  'top-start',
  'top-end'
]
const TRIGGERS = ['click', 'focus', 'hover', 'manual']
</script>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import useRootPosition from './useRootPosition'
import useTrigger from './useTrigger'
const props = defineProps({
  placement: {
    // 弹框显示位置
    type: String,
    default: 'bottom', // 'bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end',
    validator(key) {
      const isContant = PLACEMENTS.includes(key)
      if (!isContant) {
        throw new Error(`placement must be 【${PLACEMENTS.join('、')}】`)
      }
      return true
    }
  },
  trigger: {
    // 触发方式
    type: String,
    default: 'click', // click/focus/hover/manual
    validator(key) {
      const isContant = TRIGGERS.includes(key)
      if (!isContant) {
        throw new Error(`trigger must be 【${TRIGGERS.join('、')}】`)
      }
      return true
    }
  }
})
const tipRoot = ref(null)
const tipPosition = ref({})
const { rootPosition, popoverRoot } = useRootPosition()
const tipVisible = useTrigger(popoverRoot, tipRoot, props.trigger)

const tipStyle = computed(() => {
  const {
    left: rootLeft,
    top: rootTop,
    width: rootWidth,
    height: rootHeight
  } = rootPosition.value
  const { width, height } = tipPosition.value
  switch (props.placement) {
    case 'bottom': {
      const rootCenterX = (rootLeft + rootLeft + rootWidth) / 2
      return {
        left: `${rootCenterX - width / 2}px`,
        top: `${rootTop + rootHeight}px`
      }
    }
    case 'bottom-start': {
      return {
        left: `${rootLeft}px`,
        top: `${rootTop + rootHeight}px`
      }
    }
    case 'bottom-end': {
      return {
        left: `${rootLeft - (width - rootWidth)}px`,
        top: `${rootTop + rootHeight}px`
      }
    }

    case 'top': {
      const rootCenterX = (rootLeft + rootLeft + rootWidth) / 2
      return {
        left: `${rootCenterX - width / 2}px`,
        top: `${rootTop - height}px`
      }
    }
    case 'top-start': {
      return {
        left: `${rootLeft}px`,
        top: `${rootTop - rootHeight}px`
      }
    }
    case 'top-end': {
      return {
        left: `${rootLeft - (width - rootWidth)}px`,
        top: `${rootTop - rootHeight}px`
      }
    }
  }
})

watch(
  () => tipVisible.value,
  (v) => {
    if (v) {
      nextTick(() => {
        const { width, height } = tipRoot.value.getBoundingClientRect()
        tipPosition.value = { width, height }
      })
    }
  }
)
</script>

<style scoped lang="scss">
.popover-tip-enter-from,
.popover-tip-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
.popover-tip-enter-active,
.popover-tip-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
</style>
