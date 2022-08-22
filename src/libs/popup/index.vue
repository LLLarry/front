<template>
  <Teleport to="body">
    <Transition name="popup-mask" mode="out-in">
      <!-- 遮罩层 -->
      <div
        class="fixed left-0 top-0 right-0 bottom-0 bg-black/80 z-30"
        @click="onMask"
        v-if="modelValue"
      ></div>
    </Transition>

    <Transition name="popup-slide" mode="out-in">
      <!-- 内容区域 -->
      <div
        class="bg-white overflow-y-auto z-30 fixed left-0 bottom-0 right-0"
        :style="style"
        v-bind="$attrs"
        v-if="modelValue"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'
const props = defineProps({
  modelValue: Boolean,
  style: String | Object
})
const emits = defineEmits(['update:modelValue'])

const onMask = () => {
  emits('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (v) => {
    const body = document.querySelector('body')
    let initStyle = ''
    if (v) {
      initStyle = body.style.overflow
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = initStyle
    }
  }
)
</script>

<style scoped lang="scss">
.popup-mask-enter-from,
.popup-mask-leave-to {
  opacity: 0;
}
.popup-mask-enter-active,
.popup-mask-leave-active {
  transition: all 0.3s;
}

.popup-slide-enter-from,
.popup-slide-leave-to {
  transform: translateY(100%);
}
.popup-slide-enter-active,
.popup-slide-leave-active {
  transition: all 0.3s;
}
</style>
