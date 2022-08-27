import { watch } from 'vue'

/**
 * 动态给data设置_style 属性
 * _style = {
 *  left: 'xxx px',
 *  top: 'xxx px',
 *  width: 'xxx px'
 * }
 */
export default function useLocation({
  columnLefts,
  itemHeights,
  columnWidth,
  columnHeights,
  fmtGaps,
  props
}) {
  watch(
    itemHeights,
    (v) => {
      // 当每一项的高度不存在时，不往下走
      if (v.length <= 0) return
      // console.log(v.length, props.data.length)
      for (const [key, item] of Object.entries(props.data)) {
        const index = Number(key)

        if (item._style) continue
        const minColumnHeight = getMinValue(columnHeights.value)
        // 找到最小高度的索引
        const minColumnIndex = getIndex(columnHeights.value, minColumnHeight)
        // 通过索引找到对应的left值 --- 设置为left
        const left = columnLefts.value[minColumnIndex]
        // 计算得出top的值 top计算公式
        // 1、minColumnHeight 等于0时 top = 0
        // 2、minColumnHeight 不等于0时 top = minColumnHeight + 纵向间距
        const top =
          minColumnHeight === 0 ? 0 : minColumnHeight + fmtGaps.value[1]
        // _style设置成功之后 columnLefts最小的那一列 + 新添加元素的高度 + 纵向间距

        columnHeights.value[minColumnIndex] =
          minColumnHeight + itemHeights.value[index] + fmtGaps.value[1]
        // // 找到
        item._style = {
          left,
          top,
          width: columnWidth.value
        }
      }
    },
    {
      immediate: true
    }
  )
}

/**
 * 获取最小高度
 * @param {*} heights
 * @returns
 */
function getMinValue(heights) {
  return Math.min(...heights)
}

/**
 * 获取索引
 * @param {*} heights  target
 * @returns
 */
function getIndex(heights, target) {
  return heights.findIndex((height) => height === target)
}
