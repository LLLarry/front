import { THEME_LIGHT } from '@/constants'
export default {
  namespaced: true,
  state() {
    return {
      themeType: THEME_LIGHT
    }
  },
  mutations: {
    changeTheme(state, themeType) {
      state.themeType = themeType
    }
  }
}
