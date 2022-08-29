import { watch, onBeforeUnmount, isRef } from 'vue'
const useIntersectionObserver = (target, cb) => {
  let element = null
  let ios = null

  // 执行监听函数
  const handleEval = (element) => {
    ios = new window.IntersectionObserver((entries) => {
      cb && cb(entries[0])
    })
    ios.observe(element)
  }
  // 是否是ref对象？ 当时ref对象时执行watch函数，当不是ref对象时，直接执行监听函数
  if (isRef(target)) {
    watch(
      target,
      (t) => {
        if (!t) return
        element = t
        handleEval(element)
      },
      {
        immediate: true
      }
    )
  } else {
    element = target
    handleEval(element)
  }

  const stop = () => {
    ios && ios.unobserve(element)
  }
  const start = (ele) => {
    ios && ios.unobserve(ele || element)
    ios && ios.observe(ele || element)
  }
  // 卸载钱结束监听任何元素
  // onBeforeUnmount(() => {
  //   stop()
  // })

  return {
    stop,
    start
  }
}
export default useIntersectionObserver
