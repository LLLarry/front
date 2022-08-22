import { defineAsyncComponent } from 'vue'

// 导出对象、这个对象有install方法，这样既可以通过app.use(options)来使用
export default {
  install(app) {
    // 1、获取当前文件下所有以index.vue结尾的文件
    const components = import.meta.glob('./*/index.vue')
    for (const [path, fn] of Object.entries(components)) {
      // 2、根据path生成组件名称, defineAsyncComponent生成动态组件
      const componentName = path.replace(/(\.\/)|(\/index\.vue)/g, '')
      const Com = defineAsyncComponent(fn)
      // 3、将组件注册到app上
      app.component(componentName, Com)
    }
  }
}
