/***
 * 向同源且不同tab标签页发送数据
 */

// BroadcastChannel的信道key； 或者localStorage的设置项的key
const BROAD_CASE_CHANNEL_KEY = 'BROAD_CASE_CHANNEL_KEY'
// BroadcastChannel实例
let broadcastChannel = null
if (window.BroadcastChanne) {
  // 创建BroadcastChannel实例
  broadcastChannel = new window.BroadcastChanne(BROAD_CASE_CHANNEL_KEY)
}
/**
 * 发送数据
 * @param {*} data 发送的数据包
 */
export const sendMsg = (data) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage(data)
  } else {
    window.localStorage.setItem(BROAD_CASE_CHANNEL_KEY, JSON.stringify(data))
  }
}

/**
 * 监听数据传输
 * @returns promise对象
 */
export const listener = () => {
  return new Promise((resolve, reject) => {
    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        resolve(event.data)
      }
    } else {
      window.onstorage = (event) => {
        if (event.key === BROAD_CASE_CHANNEL_KEY) {
          resolve(event.newValue)
        }
      }
    }
  })
}

/**
 * 关闭监听
 */
export const close = () => {
  if (broadcastChannel) {
    broadcastChannel.close()
  } else {
    window.localStorage.removeItem(BROAD_CASE_CHANNEL_KEY)
  }
}
