<template>
  <button
    class="duration-300 inline-flex items-center justify-center active:scale-105"
    :class="[
      sizeClass,
      typeClass,
      plainClass,
      block ? 'block' : '',
      { 'opacity-50 active:scale-100': isDisbaled }
    ]"
    :disabled="isDisbaled"
    @mouseover="mouseIsOver = true"
    @mouseleave="mouseIsOver = false"
  >
    <svg-icon
      v-if="loading"
      name="loading"
      class="w-[1em] h-[1em] duration-300 animate-spin"
      :class="{ 'mr-0.5': !!$slots.default || icon }"
      :color="svgColorClass"
    />
    <svg-icon
      v-if="icon"
      :name="icon"
      class="w-[1em] h-[1em] duration-300"
      :class="{ 'mr-0.5': !!$slots.default && icon }"
      :color="svgColorClass"
    />
    <slot />
  </button>
</template>

<script>
const defineType = {
  primary:
    'bg-blue-400 hover:bg-blue-500 duration-300 text-white rounded-sm border border-blue-400',
  warning:
    'bg-amber-400 hover:bg-amber-500 duration-300 text-white rounded-sm border border-amber-400',
  danger:
    'bg-red-400 hover:bg-red-500 duration-300 text-white rounded-sm border border-red-400',
  success:
    'bg-emerald-400 hover:bg-emerald-500 duration-300 text-white rounded-sm border border-emerald-400',
  default:
    'bg-white hover:bg-zinc-200 duration-300 text-zinc-600 rounded-sm border border-white-400'
}

const defineSize = {
  small: 'py-0.5 px-0.5 text-xs',
  middle: 'py-[6px] px-1 text-sm',
  default: 'py-[8px] px-1.5 text-sm',
  large: 'py-1 px-2 text-sm'
}
</script>

<script setup>
import { computed, ref, useSlots } from 'vue'
import SvgIcon from '../svg-icon/index.vue'
// const slot = useSlots()
// console.log(slot.default)
const mouseIsOver = ref(false)
const props = defineProps({
  type: {
    type: String,
    default: 'primary', // 'primary', 'warning', 'danger', 'success', 'default'
    validator(key) {
      const isContant = Object.keys(defineType).includes(key)
      if (!isContant) {
        throw new Error(
          `type must be 【${Object.keys(defineType).join('、')}】`
        )
      }
      return true
    }
  },
  size: {
    type: String,
    default: 'middle', // large , default, middle, small
    validator(key) {
      const isContant = Object.keys(defineSize).includes(key)
      if (!isContant) {
        throw new Error(
          `size must be 【${Object.keys(defineSize).join('、')}】`
        )
      }
      return true
    }
  },
  icon: {
    type: String
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const typeClass = computed(() =>
  defineType[props.type] ? defineType[props.type] : defineType.primary
)

const sizeClass = computed(() =>
  defineSize[props.size] ? defineSize[props.size] : defineType.middle
)

const plainClass = computed(() =>
  props.plain
    ? `bg-transparent ${
        props.type === 'primary'
          ? 'text-blue-400 hover:text-white'
          : props.type === 'warning'
          ? 'text-amber-400 hover:text-white'
          : props.type === 'danger'
          ? 'text-red-400 hover:text-white'
          : props.type === 'success'
          ? 'text-emerald-400 hover:text-white'
          : props.type === 'default'
          ? 'text-zinc-700 hover:text-white'
          : ''
      }`
    : ''
)
const svgColorClass = computed(() =>
  props.plain && !mouseIsOver.value
    ? `${
        props.type === 'primary'
          ? 'rgb(96, 165, 250)'
          : props.type === 'default'
          ? 'rgb(63, 63, 70)'
          : props.type === 'danger'
          ? 'rgb(248, 113, 113)'
          : props.type === 'success'
          ? 'rgb(52, 211, 153)'
          : props.type === 'warning'
          ? 'rgb(251, 191, 36)'
          : '#ffffff'
      }`
    : '#ffffff'
)
const isDisbaled = computed(() => props.disabled || props.loading)
</script>

<style></style>
