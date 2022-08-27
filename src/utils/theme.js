import { watch, ref } from 'vue'
import store from '@/store'
import { THEME_LIGHT, THEME_DARK, THEME_SYSTEM } from '@/constants'

const watchSystemThemeChange = () => {
  // 系统主题色
  const systemTheme = ref('light')
  const mam = window.matchMedia('(prefers-color-scheme: dark)')
  systemTheme.value = mam.matches ? 'dark' : 'light'
  // 监听系统主题色的变化
  mam.onchange = () => {
    systemTheme.value = mam.matches ? 'dark' : 'light'
  }
  return systemTheme
}

/**
 * 监听vuex中的themeType的改变，动态设置html的class的类名
 */
export const useTheme = () => {
  // 监听系统主题色的改变
  const systemTheme = watchSystemThemeChange()
  watch(
    [() => store.getters.themeType, systemTheme],
    ([themeType, st]) => {
      console.log(themeType, st)
      // 根据themeType获取到对应的class类名
      let classStr = ''
      switch (themeType) {
        case THEME_LIGHT:
          classStr = 'light'
          break
        case THEME_DARK:
          classStr = 'dark'
          break
        case THEME_SYSTEM:
          classStr = st
          break
      }
      const html = document.documentElement
      // 先清除html的light、dark类名、再设置类名
      html.classList.remove('light', 'dark')
      if (classStr) {
        html.classList.add(classStr)
      }
    },
    {
      immediate: true
    }
  )
}
