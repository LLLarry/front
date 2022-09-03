import { createApp } from 'vue'
import '@/styles/index.scss'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { useREM } from '@/utils/flexible'
import { useTheme } from '@/utils/theme'
import libs from '@/libs'
import directives from '@/directives'
import 'virtual:svg-icons-register'

useREM()
useTheme()

createApp(App).use(router).use(store).use(libs).use(directives).mount('#app')
