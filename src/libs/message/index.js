import { h, render, ref } from 'vue'
import messageComponent from './index.vue'
let count = 0
let timer = null
export const canClose = ref(false)
export const idMapTime = ref({})
export default class Message {
  static init(props) {
    clearTimeout(timer)
    canClose.value = false
    timer = setTimeout(() => {
      canClose.value = true
    }, 500)
    ++count
    idMapTime.value[count] = count * 150
    const el = document.createElement('div')
    document.body.appendChild(el)
    // 当关闭动画执行完成之后调用此函数，此函数卸载dom
    const onClose = (id) => {
      props.onClose?.()
      render(null, el)
      document.body.removeChild(el)
      --count
    }
    // 将messageComponent转化成虚拟dom数
    const vnode = h(messageComponent, { ...props, close: onClose, id: count })
    // 利用render函数，将虚拟dom树挂载到body上
    render(vnode, el)
  }
  /**
   * message:
   *
   */
  static success(message, onClose) {
    Message.init({ message, onClose, type: 'success' })
  }
  static warning(message, onClose) {
    Message.init({ message, onClose, type: 'warning' })
  }
  static error(message, onClose) {
    Message.init({ message, onClose, type: 'error' })
  }
  static info(message, onClose) {
    Message.init({ message, onClose, type: 'info' })
  }
}
