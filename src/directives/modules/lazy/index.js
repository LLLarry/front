import useIntersectionObserver from '@/libs/infinite-list/useIntersectionObserver'
// 处理图片懒加载
// 1、在元素挂载到页面中的钩子函数中、保存img的src
// 2、将img的src属性置为 空 或者置位默认图片
// 3、监听图片是否在可视范围内？ 在可视范围内将img保存在src重新复制到img上 并 取消监听
export default {
  mounted(el, { value = null }) {
    // 1、在元素挂载到页面中的钩子函数中、保存img的src
    const catchSrc = el.src
    // 2、将img的src属性置为 空 或者置位默认图片
    el.src = value
    //  3、监听图片是否在可视范围内？
    const { stop } = useIntersectionObserver(el, ({ isIntersecting }) => {
      if (isIntersecting) {
        // 4、在可视范围内将img保存在src重新复制到img上 并 取消监听
        el.src = catchSrc
        stop()
      }
    })
  }
}
