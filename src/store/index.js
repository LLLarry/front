import { createStore } from 'vuex'
import getters from './getters'
import categorys from './modules/categorys'
import app from './modules/app'
import theme from './modules/theme'
import search from './modules/search'
import user from './modules/user'
// import vuexPresisted from './plugins/vuex-presisted'
import createPersistedState from 'vuex-persistedstate'
const store = createStore({
  getters,
  modules: { categorys, theme, app, search, user },
  plugins: [
    createPersistedState({
      key: '__front__',
      paths: ['categorys', 'theme', 'search', 'user']
    })
  ]
})

export default store
