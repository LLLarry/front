<template>
  <div class="overflow-hidden bg-white dark:bg-zinc-800 duration-500">
    <ul
      class="w-[800px] mx-auto flex flex-wrap justify-center duration-300 overflow-hidden relative select-none"
      ref="ulRef"
      :style="ulHeightStyle"
    >
      <li
        class="duration-300 p-1 rounded-sm hover:bg-zinc-200 cursor-pointer absolute right-0 bottom-1.5 dark:hover:bg-zinc-900"
        @click="isOpenCategory = !isOpenCategory"
      >
        <svg-icon
          :name="icon"
          class="w-1 h-1 fill-zinc-600 dark:fill-zinc-500 dark:hover:fill-zinc-300"
        ></svg-icon>
      </li>
      <li
        class="text-base font-bold px-1.5 py-1 rounded-sm duration-300 hover:bg-zinc-200 text-zinc-900 mr-1 mb-1 cursor-pointer dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-900"
        :class="{
          'bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300':
            curretIndex === index
        }"
        v-for="(category, index) in categorys"
        :key="category.id"
        @click="selcectCatrgory(index)"
      >
        {{ category.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
// 是否打开分类页
const isOpenCategory = ref(false)
// 展开关闭图标
const icon = computed(() => (isOpenCategory.value ? 'fold' : 'unfold'))
// ul实例
const ulRef = ref(null)
// ul的高度 [关闭高度、展开高度]
const ulHeights = ref(['auto', 'auto'])
// 选中菜单的索引
const curretIndex = ref(0)

const categorys = computed(() => store.getters.categorys)
// 监听categorys数据改变、改变之后在页面渲染之后获取展示ul展示和隐藏的高度
watch(
  categorys,
  async (v) => {
    if (v.length <= 0) return false
    await nextTick()
    // 获取最后一个子元素
    const children = ulRef.value.children
    const lastLi = children[children.length - 1]
    ulHeights.value = [
      `${lastLi.offsetHeight + 10}px`, // ul的最小高度为一个list的高度 + marginBottom的值
      `${ulRef.value.scrollHeight}px` // ul的最大高度为内部滚动元素的高度，（这里不能使用offsetHeight，因为在初始化时默认有初始化数据，初始化数据也会触发watch函数计算出高度、而此时没有展开，所以高度还是最小高度、那么当真实数据拿到时，如果获取到offsetHeight那么获取到的就是ul的最小高度、我们需要获取的是ul的真实高度、而真实高度就是子元素的滚动高度）
    ]
  },
  {
    immediate: true
  }
)

const selcectCatrgory = (index) => {
  curretIndex.value = index
}
const ulHeightStyle = computed(() => ({
  height: isOpenCategory.value ? ulHeights.value[1] : ulHeights.value[0]
}))
</script>
