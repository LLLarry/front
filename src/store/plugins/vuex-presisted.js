const vuexPresisted =
  ({ key = '__presisted__', paths = [] } = options) =>
  (store) => {
    // 1、初始化时从缓存中获取缓存的数据
    const map = getPresisted(key)
    // 2、将数据挂载到state中
    for (const [module, data] of Object.entries(map)) {
      store.state[module] = data
    }
    // 当 store 初始化后调用
    store.subscribe((mutation, state) => {
      // 每次 mutation 之后调用
      // mutation 的格式为 { type, payload }
      // 每次触发mutation提交之后，都判断提交的module是不是缓存的数据，如果是，则将数据缓存起来
      const { type, payload } = mutation
      // 获取模块名
      const moduleName = type.split('/')[0]
      // 判断模块名是否在配置项中
      if (paths.includes(moduleName)) {
        // 获取state中的数据
        const value = store.state[moduleName]
        // 获取缓存中的map对象
        const map = getPresisted(key)
        // 将state中的数据设置到map对象中
        map[moduleName] = value
        // 将map对象缓存到本地
        localStorage.setItem(key, JSON.stringify(map))
      }
    })
  }

export default vuexPresisted

function getPresisted(key) {
  let map = {}
  try {
    map = JSON.parse(localStorage.getItem(key)) || {}
  } catch (error) {
    map = {}
  }
  return map
}
