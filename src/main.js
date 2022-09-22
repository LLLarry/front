import { createApp, h } from 'vue'
import '@/styles/index.scss'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { useREM } from '@/utils/flexible'
import { useTheme } from '@/utils/theme'
import libs from '@/libs'
import directives from '@/directives'
import 'virtual:svg-icons-register'
import './premission'
import saveScroll from '@/assets/js/saveScroll'
useREM()
useTheme()

createApp(App)
  .use(router)
  .use(store)
  .use(libs)
  .use(directives)
  .mixin(saveScroll)
  .mount('#app')
