<template>
  <slot :data="{ timeStr, timeValue }">
    <div>
      {{ timeStr }}
    </div>
  </slot>
</template>

<script setup>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import 'dayjs/locale/zh-cn'
import { watch, ref, computed, onUnmounted } from 'vue'

dayjs.extend(duration)
dayjs.locale('zh-cn')
let timer = null
const props = defineProps({
  time: {
    // 倒计时时间， ms单位
    type: Number,
    required: true
  },
  format: {
    // 格式化时间
    type: String,
    default: 'HH小时mm分钟ss秒SSS'
  }
})

// 组件销毁时清理定时器
onUnmounted(() => {
  close()
})
const timeValue = ref(props.time)

// 封装格式化日期函数
const fmtTime = (milliseconds) => {
  const d = dayjs.duration(milliseconds)
  return d.format(props.format)
}

const handleSetInterval = () => {
  timer = setInterval(() => {
    if (typeof timeValue.value === 'number' && timeValue.value <= 0) {
      //完成
      close()
    } else {
      timeValue.value -= 9
    }
  }, 9)
}
const timeStr = computed(() => {
  return typeof timeValue.value === 'number' ? fmtTime(timeValue.value) : ''
})
/**
 * 关闭定时器
 */
const close = () => {
  clearInterval(timer)
}
/**
 * 开启定时器
 */
const start = () => {
  handleSetInterval()
}
/**
 * 从新设置定时器
 */
const reset = (v) => {
  const setV = v > 0 ? v : props.time
  timeValue.value = setV
}
watch(
  () => props.time,
  (v) => {
    timeValue.value = v
    close()
    start()
  },
  {
    immediate: true
  }
)

defineExpose({
  close,
  start,
  reset,
  timeStr,
  timeValue
})
</script>
