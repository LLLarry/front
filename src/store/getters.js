import { DEFAULT_SCROLL_THEME } from '@/constants'
export default {
  categorys(state) {
    return state.categorys.categorys
  },
  themeType(state) {
    return state.theme.themeType
  },
  scrollTheme(state) {
    return DEFAULT_SCROLL_THEME[state.theme.theme] || {}
  },
  // 当前分类
  currentCategory(state) {
    return state.app.currentCategory
  },
  // 当前分类索引
  currentCategoryIndex(state, getters) {
    return getters.categorys.findIndex(
      (item) => item.id === getters.currentCategory.id
    )
  },
  historys(state) {
    return state.search.historys
  },
  searchText(state) {
    return state.app.searchText
  },
  token (state) {
    return state.user.token
  },
  userInfo (state) {
    return state.user.userInfo
  },
  isLogin (state) {
    return Object.keys(state.user.userInfo).length !== 0
  }
}
