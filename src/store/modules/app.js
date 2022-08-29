import { ALL_CATEGOARY_ITEM } from '@/constants'
export default {
  namespaced: true,
  state() {
    return {
      currentCategory: ALL_CATEGOARY_ITEM // 选择的分类
    }
  },
  mutations: {
    changeCurrentCategory(state, currentCategory) {
      state.currentCategory = currentCategory
    }
  }
}
