import { ALL_CATEGOARY_ITEM, ROUTER_TYPE_NONE } from '@/constants'
export default {
  namespaced: true,
  state() {
    return {
      currentCategory: ALL_CATEGOARY_ITEM, // 选择的分类
      searchText: '',
      routerType: ROUTER_TYPE_NONE // 跳转类型
    }
  },
  mutations: {
    changeCurrentCategory(state, currentCategory) {
      state.currentCategory = currentCategory
    },
    changeSearchText(state, searchText) {
      state.searchText = searchText
    },
    changeRouterType(state, routerType) {
      state.routerType = routerType
    }
  }
}
