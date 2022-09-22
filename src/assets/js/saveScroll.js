export default {
  data() {
    return {
      __scrollTop: 0, // 当前组件Y轴滚动的距离
      __isRouterComponent: false // 是否是路由组件
    }
  },
  mounted() {
    // 判断组件的根组件是不是路由组件
    this.__isRouterComponent = this.$el.parentNode.parentNode.isEqualNode(
      document.querySelector('#app')
    )
    if (!this.__isRouterComponent) return false
    // 注册滚动事件
    this.$el && this.$el.addEventListener('scroll', this.__handleScroll)
  },
  activated() {
    if (!this.__isRouterComponent) return false
    // 组件被重新激活时，重新将缓存的Y轴距离设置到根标签上
    this.$el.scrollTop = this.__scrollTop
  },
  beforeUnmount() {
    if (!this.__isRouterComponent) return false
    // 卸载之前，解绑事件
    this.$el && this.$el.removeEventListener('scroll', this.__handleScroll)
  },
  methods: {
    __handleScroll() {
      this.__scrollTop = this.$el.scrollTop
    }
  }
}
