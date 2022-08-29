export default {
  categorys(state) {
    return state.categorys.categorys
  },
  themeType(state) {
    return state.theme.themeType
  },
  // 当前分类
  currentCategory (state) {
    return state.app.currentCategory
  },
  // 当前分类索引
  currentCategoryIndex (state, getters) {
    return  getters.categorys.findIndex(item => item.id === getters.currentCategory.id)
  }
}
