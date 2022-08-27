import { ALL_CATEGOARY_ITEM, DEFAULT_CATEGOARS } from '@/constants'
import { getCategories } from '@/api/categories'

// 处理 navigation中头部数据部分
export default {
  namespaced: true,
  state() {
    return {
      categorys: [ALL_CATEGOARY_ITEM, ...DEFAULT_CATEGOARS]
    }
  },
  mutations: {
    setCategorys(state, categorys) {
      state.categorys = [ALL_CATEGOARY_ITEM, ...categorys]
    }
  },
  actions: {
    async getCategorysData({ commit }) {
      const { categorys } = await getCategories()
      commit('setCategorys', categorys)
    }
  }
}
