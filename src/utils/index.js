import md5 from 'md5'

export const getSecret = () => {
  const codetype = Number.parseInt(Date.now() / Math.pow(10, 3))
  const icode = md5(`${codetype}LGD_Sunday-1991`)
  return { codetype, icode }
}

export const scrollTransition = () => {
  let timer = null
  return function exec({
    el = document.body,
    position = 0,
    direction = 'v',
    time = 150
  } = options) {
    clearInterval(timer)
    // 每步的时间 ms
    const TIME_EVERY_STEP = 5
    // 最大滚动距离
    const maxScrollSize = el.scrollWidth - el.offsetWidth
    // 限定position的有效滚动范围
    position = Math.max(Math.min(position, maxScrollSize), 0)
    // 可以分为多少步
    let steps = Math.ceil(time / TIME_EVERY_STEP)
    const stepSize = (position - el.scrollLeft) / steps // 每步的长度

    timer = setInterval(() => {
      // console.log(el.scrollLeft , position)
      if (el.scrollLeft !== Number.parseInt(position) && position >= 0) {
        if (stepSize >= 0) {
          let scrollX =
            el.scrollLeft + stepSize >= position
              ? position
              : el.scrollLeft + stepSize
          el.scrollLeft = scrollX
        } else {
          let scrollX =
            el.scrollLeft + stepSize <= position
              ? position
              : el.scrollLeft + stepSize
          el.scrollLeft = scrollX
        }
      } else {
        clearInterval(timer)
      }
    }, TIME_EVERY_STEP)
  }
}

/**
 * 创建随机颜色
 * @returns
 */
export const createRandomColor = () => {
  const randomNum = () => Math.floor(Math.random() * 256)
  return `rgba(${randomNum()}, ${randomNum()}, ${randomNum()})`
}
