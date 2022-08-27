import { ref, computed } from 'vue'

// 格式化间距
const useFmtGaps = (props) => {
  // 格式化间隔
  const fmtGaps = computed(() => {
    if (Array.isArray(props.gaps)) {
      return props.gaps.map((gap) => {
        if (typeof gap === 'number') {
          return gap
        }
        return Number(gap)
      })
    } else {
      return Array(2).fill(props.gaps)
    }
  })
  return fmtGaps
}

export const useInit = (props) => {
  // 每一列的left坐标
  const columnLefts = ref([])
  // 每一列的宽度
  const columnWidth = ref(0)
  // 每一列的高度
  const columnHeights = ref(Array(props.column).fill(0))
  // root根元素的实例 columnHeights 每一列高度的最大值

  const waterFallRoot = ref(null)
  // root根元素的高度 为 columnHeights 的最大值
  const rootHeight = useRootHeight(columnHeights)
  // 格式化间距
  const fmtGaps = useFmtGaps(props)

  const init = () => {
    // 初始化时重置columnHeights的值
    columnHeights.value = Array(props.column).fill(0)
    // 容器总宽度： （不包含 padding、 border、 滚动条）
    const width = getRootContainerWidth(waterFallRoot)
    // 每列宽度
    columnWidth.value = getColumnWidth(props, waterFallRoot, fmtGaps)
    // 每列left坐标
    columnLefts.value = getColumnLefts(props, columnWidth, fmtGaps)
  }
  return {
    columnLefts,
    columnWidth,
    waterFallRoot,
    fmtGaps,
    columnHeights,
    rootHeight,
    init
  }
}

/**
 * 获取每列的宽度 计算公式： 每列的宽度 =（容器总宽度（不包含padding、 border、 scroll） - (列数column - 1) * 横向列宽）/ 列数column
 * @param {*} props
 * @param {*} waterFallRoot
 * @param {*} fmtGaps
 * @returns
 */
function getColumnWidth(props, waterFallRoot, fmtGaps) {
  const width = waterFallRoot.value.clientWidth
  return (width - (props.column - 1) * fmtGaps.value[0]) / props.column
}

// 获取每列的left坐标
function getColumnLefts(props, columnWidth, fmtGaps) {
  // 获取每一列的left的坐标
  // 第一项为0， 剩下的每一项都是left的最后一项 + 每一列宽度 + 横向间距
  let count = props.column
  const lefts = []
  while (count > 0) {
    if (lefts.length <= 0) {
      lefts.push(0)
    } else {
      lefts.push(lefts[lefts.length - 1] + columnWidth.value + fmtGaps.value[0])
    }
    count--
  }
  return lefts
}

// 获取父容器总宽度： （不包含 padding、 border、 滚动条）

function getRootContainerWidth(waterFallRoot) {
  const styles = window.getComputedStyle(waterFallRoot.value)
  // clientWidth包含content + padding，所以需要把左右内边距减掉
  const width =
    waterFallRoot.value.clientWidth -
    Number.parseFloat(styles.paddingLeft) -
    Number.parseFloat(styles.paddingRight)
  return width
}

// 获取根元素的高度
function useRootHeight(columnHeights) {
  return computed(() => {
    return Math.max(...columnHeights.value) || 0
  })
}
