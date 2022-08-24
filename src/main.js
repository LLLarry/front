import { createApp } from 'vue'
import '@/styles/index.css'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { useREM } from '@/utils/flexible'
import libs from '@/libs'
import 'virtual:svg-icons-register'

useREM()

createApp(App).use(router).use(store).use(libs).mount('#app')
