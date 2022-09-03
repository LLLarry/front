<template>
  <transition name="down">
    <div
      class="message-box text-base rounded-sm shadow-md cursor-pointer border overflow-hidden p-1 min-w-[380px] fixed z-50 left-1/2 top-4 translate-x-[-50%]"
      :style="typeStyle.divStyle"
      v-if="visible"
    >
      <span :style="typeStyle.spanStyle" class="leading-3 text-sm">{{
        message
      }}</span>
    </div>
  </transition>
</template>
<script>
const TYPES_SUCCESS = 'success'
const TYPES_ERROR = 'error'
const TYPES_WARNING = 'warning'
const TYPES_INFO = 'info'

const TYPES_STYLE = {
  [TYPES_SUCCESS]: {
    divStyle: 'background-color:#f0f9eb; border-color:#e1f3d8;',
    spanStyle: 'color:#67C23A'
  },
  [TYPES_ERROR]: {
    divStyle: 'background-color:#fef0f0;border-color:#fde2e2;',
    spanStyle: 'color:#F56C6C'
  },
  [TYPES_WARNING]: {
    divStyle: 'background-color:#fdf6ec;border-color:#faecd8;',
    spanStyle: 'color:#E6A23C'
  },
  [TYPES_INFO]: {
    divStyle: 'background-color:#edf2fc;border-color:#EBEEF5;',
    spanStyle: 'color:#909399'
  }
}
const DURATION = '0.5s' // 定义过渡时间
</script>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { idMapTime, canClose } from './index'
import { contralTimeout } from '@/utils'
const props = defineProps({
  type: {
    type: String,
    default: TYPES_INFO,
    validator(key) {
      const types = [TYPES_SUCCESS, TYPES_ERROR, TYPES_WARNING, TYPES_INFO]
      if (!types.includes(key)) {
        console.error('type must be ' + types.join('、'))
      }
      return true
    }
  },
  message: {
    type: String,
    required: true
  },
  close: {
    type: Function
  },
  duration: {
    // 多久关闭 ms
    type: Number,
    default: 3000
  },
  id: {
    type: Number
  }
})
const visible = ref(false)
const typeStyle = computed(() => {
  const styles = TYPES_STYLE[props.type]
  const top = `top: ${62 * (props.id - 1) + 16}px;`
  styles.divStyle += top
  return styles
})
const showTime = computed(() => Math.max(props.duration, 0)) // 展示时间 ms
const { start, stop } = contralTimeout(
  showTime.value + idMapTime.value[props.id],
  () => {
    visible.value = false
  }
)
// 挂载之后再显示
onMounted(() => {
  visible.value = true
  // showTime ms后关闭显示，此时开始执行关闭动画 DURATION 时间后动画执行完毕、开始调用close函数
  // setTimeout(() => {
  //   visible.value = false
  // }, showTime.value + idMapTime.value[props.id])
})

watch(visible, (v) => {
  if (!v) {
    // 此时开始执行关闭动画 DURATION 时间后动画执行完毕、开始调用close函数
    // props.close?.(props.id)
    setTimeout(() => {
      delete idMapTime.value[props.id]
      props.close?.()
    }, Number.parseFloat(DURATION) * 1000)
  }
})

// 当可以关闭之后再进行开始定时器、当不可关闭后关闭定时器
watch(canClose, (v) => {
  if (v) {
    start()
  } else {
    stop()
  }
})
</script>

<style lang="scss" scoped>
.down-enter-from,
.down-leave-to {
  transform: translate3d(-50%, -2.5rem, 0);
  opacity: 0;
}
.down-enter-active,
.down-leave-active {
  transition: all v-bind('DURATION') ease-in-out;
}
</style>
