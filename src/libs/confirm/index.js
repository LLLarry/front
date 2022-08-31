import { h, render } from 'vue'
import ConfirmComponent from './index.vue'

export default (options) => {
  return new Promise((resolve, reject) => {
    let {
      title,
      content,
      cancelText,
      okText,
      onCancel: onCancelFn,
      onOk: onOkFn,
      close: closeFn
    } = options
    if (!title && !content)
      return console.error(`【confirm】 title or content must be have value!`)
    if (title && !content) {
      content = title
      title = ''
    }
    // 处理取消回调
    const onCancel = () => {
      onCancelFn?.()
      reject('cancel')
    }
    // 处理确认回调
    const onOk = () => {
      onOkFn?.()
      resolve('confirm')
    }
    // 在用户点击关闭弹框后，会延时500ms执行close，目的是让动画走完
    const close = () => {
      closeFn?.()
      // 此时动画已经走完、所以将组件从页面中移除
      render(null, document.body)
    }

    // 通过h函数将Confirm组件创建成对应的虚拟dom ， 第二项传入组件的属性值
    const vnode = h(ConfirmComponent, {
      title,
      content,
      cancelText,
      okText,
      onCancel,
      onOk,
      close
    })

    // 通过render函数创虚拟dom挂载到真实dom上
    render(vnode, document.body)
  })
}
