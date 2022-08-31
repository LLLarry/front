<template>
  <div
    class="search-com flex items-center flex-1 relative p-[6px] rounded-full hover:bg-red-50 duration-500 dark:hover:bg-red-50/30"
    @click.stop.prevent
  >
    <!-- 前置icon -->
    <svg-icon
      name="search"
      class="w-1.5 h-1.5 absolute translate-y-[-50%] top-[50%] left-3 dark:fill-zinc-400"
    />
    <!-- 搜索input -->
    <input
      :value="modelValue"
      type="text"
      placeholder="搜索"
      @focus.stop="onFocus"
      @blur.stop="onBlur"
      @input.stop="onInput"
      @change.stop="onChange"
      @keydown.enter.stop="onConfirm"
      class="flex-1 bg-zinc-100 rounded-full h-[44px] px-5 border-2 border-zinc- text-sm font-semibold outline-none hover:border-red-300 hover:bg-white placeholder:text-sm duration-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
    />
    <!-- 清空按钮 -->
    <div
      v-if="inputDeleteVisible"
      @click.stop="onCancelText"
      class="p-1 absolute right-[75px] translate-y-[-50%] top-[50%] cursor-pointer"
    >
      <svg-icon name="input-delete" class="w-1.5 h-1.5" color="#666666" />
    </div>
    <!-- 搜索按钮 -->
    <Button
      type="danger"
      icon="search"
      class="search-btn cursor-pointer w-[40px] h-[40px] rounded-full absolute translate-y-[-50%] top-[50%] right-[12px] opacity-0 dark:bg-transparent dark:border-transparent dark:hover:bg-zinc-900 dark:text-zinc-500"
      @click.stop="onConfirm"
    />
    <!-- 搜索提示 -->
    <transition name="search-tip">
      <div
        class="absolute z-50 shadow left-0 right-0 bottom-0 rounded-sm bg-white border border-zinc-300 translate-y-full p-1 max-h-[270px] overflow-auto dark:bg-zinc-800 duration-300 dark:border-zinc-600"
        v-if="visible"
      >
        <slot name="dropdown" />
      </div>
    </transition>
  </div>
</template>

<script>
const EVENT_TYPES = [
  'input',
  'change',
  'focus',
  'blur',
  'confirm',
  'update:modelValue'
]
</script>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const emits = defineEmits(EVENT_TYPES)
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})
const visible = ref(false)
// 是否执行清零按钮
const inputDeleteVisible = computed(
  () => props.modelValue && props.modelValue.length > 0
)
const handleUpdateValue = (value) => {
  emits('update:modelValue', value)
}
const onFocus = (...argu) => {
  visible.value = true
  emits('focus', argu)
}
const onBlur = (...argu) => {
  emits('blur', argu)
}
const onInput = (...argu) => {
  handleUpdateValue(argu[0].target.value)
  emits('input', { value: props.modelValue, ...argu })
}
const onChange = (...argu) => {
  emits('change', { value: props.modelValue, ...argu })
}
const onConfirm = () => {
  emits('confirm', { value: props.modelValue })
}
const onCancelText = () => {
  handleUpdateValue('')
}

// 点击search任何地方关闭提示栏
function handleEvent() {
  visible.value = false
}
onMounted(() => {
  document.addEventListener('click', handleEvent)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleEvent)
})
</script>

<style lang="scss" scoped>
.search-tip-enter-from,
.search-tip-leave-to {
  opacity: 0;
  transform: translateY(150%);
}

.search-tip-enter-active,
.search-tip-leave-active {
  transition: all 0.3s ease-in-out;
}

.search-com {
  &:hover {
    .search-btn {
      opacity: 1;
    }
  }
}
</style>
