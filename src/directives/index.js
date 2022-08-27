export default {
  install(app) {
    // 加载指令对象
    const directives = import.meta.globEager('./modules/*/*.js')
    for (const [key, value] of Object.entries(directives)) {
      // 转化name
      const name = key
        .replace(/\.\/\w+\/(.+)?\/index\.js/, '$1')
        .replace(/-(\w)/g, (match, $1) => {
          return $1.toUpperCase()
        })
      // 绑定指令
      app.directive(name, value.default)
    }
  }
}
