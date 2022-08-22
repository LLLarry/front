<template>
  <div class="flex flex-col h-[70vh]">
    <h2 class="px-1 py-2 text-zinc-900 text-lg">全部分类</h2>
    <ul class="flex-1 overflow-auto">
      <li
        class="p-1 text-zinc-700 text-base"
        v-for="(category, index) in categorys"
        :key="category.id"
        @click="$emit('handleSelectCategory', index)"
      >
        {{ category.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  categorys: {
    type: Array,
    required: true
  }
})
const emits = defineEmits(['handleSelectCategory'])
</script>

<style></style>
