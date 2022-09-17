<template>
  <div class="relative inline-flex" v-if="isInput">
    <input
      v-bind="fmtAttrs"
      :value="modelValue"
      @input="handleInput"
      type="text"
      class="appearance-none border outline-none border-zinc-200 dark:border-zinc-500 bg-white dark:bg-zinc-800 rounded-sm text-sm text-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus:border-red-500 dark:focus:border-zinc-300 px-1 py-1 duration-300"
    />
    <div
      v-if="isHasMax"
      class="absolute right-1 top-1/2 translate-y-[-50%] text-xs text-zinc-400 dark:text-zinc-600"
    >
      <span :class="{ 'text-red-500': vLength === Number(max) }">
        {{ vLength }}/{{ max }}
      </span>
    </div>
  </div>

  <!-- textarea -->
  <div class="relative inline-flex" v-else>
    <textarea
      rows="5"
      v-bind="fmtAttrs"
      :value="modelValue"
      @input="handleInput"
      type="text"
      class="appearance-none border outline-none border-zinc-200 dark:border-zinc-500 bg-white dark:bg-zinc-800 rounded-sm text-sm text-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus:border-red-500 dark:focus:border-zinc-300 px-1 py-1 duration-300"
    />
    <div
      v-if="isHasMax"
      class="absolute right-1 bottom-0 translate-y-[-20%] text-xs text-zinc-400 dark:text-zinc-600"
    >
      <span :class="{ 'text-red-500': vLength === Number(max) }">
        {{ vLength }}/{{ max }}
      </span>
    </div>
  </div>
</template>
<script>
const INPUT_TYPE_INPUT = 'input'
const INPUT_TYPE_TEXTAREA = 'textarea'
</script>

<script setup>
import { computed, useAttrs, watch } from 'vue'
const attrs = useAttrs()
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  inputType: {
    // 输入框的内容
    type: String,
    default: INPUT_TYPE_INPUT,
    validator(v) {
      const arr = [INPUT_TYPE_INPUT, INPUT_TYPE_TEXTAREA]
      if (!arr.includes(v)) {
        throw new TypeError(
          `Input component inputType must be ${arr.join('、')}`
        )
      }
      return true
    }
  },
  max: {
    // 最大输入的字数
    type: [String, Number]
  }
})
const emits = defineEmits(['update:modelValue'])
// 将props的竖向过滤掉
const fmtAttrs = computed(() => {
  const { inputType, max, ...attrMap } = attrs
  return attrMap
})
// 是否显示input
const isInput = computed(() => props.inputType === INPUT_TYPE_INPUT)

const vLength = computed(() => (props.modelValue ? props.modelValue.length : 0))
// 是否存在最大值
const isHasMax = computed(() => {
  const v = Number.parseInt(props.max)
  return !Number.isNaN(v)
})
const handleInput = ($event) => {
  emits('update:modelValue', $event.target.value)
}

watch(
  () => props.modelValue,
  (v) => {
    console.log('v', v)
    if (isHasMax.value && v !== void 0) {
      if (v.length > props.max) {
        emits('update:modelValue', v.substr(0, props.max))
      }
    }
  },
  {
    immediate: true
  }
)
</script>

<style></style>
