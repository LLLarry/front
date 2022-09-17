<template>
  <div class="flex flex-col justify-center items-center" @click="handleClick">
    <svg-icon
      :name="icon"
      v-if="icon"
      class="fill-zinc-700 dark:text-zinc-600 duration-300 w-2 h-2 mb-0.5"
      :class="iconClass"
    ></svg-icon>
    <p
      class="text-center text-sm text-zinc-800 dark:text-zinc-500 duration-300"
      :class="textClass"
    >
      <slot />
    </p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  icon: {
    type: String
  },
  iconClass: {
    type: String
  },
  textClass: {
    type: String
  },
  to: {
    type: [String, Object]
  }
})
const router = useRouter()
const handleClick = () => {
  if (!props.to) return
  router.push(props.to)
}
</script>

<style></style>
