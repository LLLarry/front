import { DEFAULT_SCROLL_THEME, ROUTER_TYPE_NONE } from '@/constants'
import { isMoboleTerminal } from '@/utils/flexible'
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
  token(state) {
    return state.user.token
  },
  userInfo(state) {
    return state.user.userInfo
  },
  isLogin(state) {
    return Object.keys(state.user.userInfo).length !== 0
  },
  routerType(state) {
    // 如果是pc端，则直接返回none
    if (!isMoboleTerminal.value) {
      return ROUTER_TYPE_NONE
    }
    // 手机端，返回app中存储的routerType
    return state.app.routerType
  }
}
