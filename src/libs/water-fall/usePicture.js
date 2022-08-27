// 在这里我们需要处理图片预加载
// 此时在处理之前、默认所有的图片所在的item都固定在容器的左上角
// 我们需要进行以下操作

import { ref } from 'vue-demi'

/**
 * 1、获取到所有的图片dom对象
 * 2、监听dom对象的onload是否成功执行？将其包装成promise对象
 * 3、执行所有的promise对象、当所有图片都成功加载时，返回所有图片的高度
 */

// 需要预加载 等待所有的元素加载完成
export function waitAllImgCompile() {
  // 每一项的高度
  let itemHeights = ref([])
  const itemElements = Array.from(
    document.querySelectorAll('.__water-fall-item__')
  )

  const promises = itemElements.map((itemElement, index) => {
    return new Promise((resolve, reject) => {
      // 创建图片实例
      const imgInstance = new Image()
      // 监听图片是否加载完成
      imgInstance.onload = () => {
        resolve({ itemElement, index })
      }
      imgInstance.onerror = () => {
        console.log('加载失败')
      }
      imgInstance.src = itemElement.querySelector('img').src
    })
  })
  Promise.all(promises)
    .then((res) => {
      itemHeights.value = res.map(({ itemElement }) => itemElement.offsetHeight)
    })
    .catch((error) => {
      console.log(error)
    })
  return itemHeights
}

// 不需要预加载
export function useImageHeights() {
  let itemHeights = ref([])
  const itemElements = Array.from(
    document.querySelectorAll('.__water-fall-item__')
  )
  itemHeights.value = itemElements.map((itemElement) => {
    return itemElement.offsetHeight
  })
  return itemHeights
}
