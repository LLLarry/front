import { THEME_LIGHT } from '@/constants'
export default {
  namespaced: true,
  state() {
    return {
      themeType: THEME_LIGHT,
      theme: 'light'
    }
  },
  mutations: {
    changeThemeType(state, themeType) {
      state.themeType = themeType
    },
    changeTheme(state, theme) {
      state.theme = theme
    }
  }
}
