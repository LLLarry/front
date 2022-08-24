<template>
  <div
    class="search-com flex items-center flex-1 relative p-[6px] rounded-full hover:bg-red-50 duration-300"
    @click.stop.prevent
  >
    <svg-icon
      name="search"
      class="w-1.5 h-1.5 absolute translate-y-[-50%] top-[50%] left-3"
    />
    <input
      :value="modelValue"
      type="text"
      placeholder="搜索"
      @focus.stop="onFocus"
      @blur.stop="onBlur"
      @input.stop="onInput"
      @change.stop="onChange"
      class="flex-1 bg-zinc-100 rounded-full h-[44px] px-5 border border-zinc-300 text-sm font-semibold outline-none duration-300 focus:border-red-300 hover:bg-white placeholder:text-sm"
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
      class="search-btn cursor-pointer w-[40px] h-[40px] rounded-full absolute translate-y-[-50%] top-[50%] right-[12px] opacity-0"
      @click.stop="onConfirm"
    />
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
import { ref, computed } from 'vue'

const emits = defineEmits(EVENT_TYPES)
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})
console.log(props)
// 是否执行清零按钮
const inputDeleteVisible = computed(
  () => props.modelValue && props.modelValue.length > 0
)
const handleUpdateValue = (value) => {
  emits('update:modelValue', value)
}
const onFocus = (...argu) => {
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
