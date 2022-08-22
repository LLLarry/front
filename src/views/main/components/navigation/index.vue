<template>
  <navigation-mobile v-if="isMoboleTerminal" :data="categorys" />
  <navigation-pc v-else />
</template>

<script setup>
import NavigationMobile from './mobile/index.vue'
import NavigationPc from './pc/index.vue'
import { isMoboleTerminal } from '@/utils/flexible'
import { getCategories } from '@/api/categories'
import { ALL_CATEGOARY_ITEM } from '@/constants'
import { ref } from 'vue'
const categorys = ref([])
const getCategoriesData = async () => {
  const res = await getCategories()
  categorys.value = res.categorys
  categorys.value.unshift(ALL_CATEGOARY_ITEM)
}
getCategoriesData()
</script>

<style></style>
