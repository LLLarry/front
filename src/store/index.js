import { createStore } from 'vuex'
import getters from './getters'
import categorys from './modules/categorys'
import app from './modules/app'
import theme from './modules/theme'
// import vuexPresisted from './plugins/vuex-presisted'
import createPersistedState from 'vuex-persistedstate'
const store = createStore({
  getters,
  modules: { categorys, theme, app },
  plugins: [
    createPersistedState({
      key: '__front__',
      paths: ['categorys', 'theme']
    })
  ]
})

export default store
