import { createStore } from 'vuex'
import getters from './getters'
import categorys from './modules/categorys'
const store = createStore({
  getters,
  modules: { categorys }
})

export default store
