import { ref, onMounted, onBeforeUnmount } from 'vue'

function useRootPosition() {
  const rootPosition = ref({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  })
  const popoverRoot = ref(null)
  function scrollFn() {
    rootPosition.value = getRect(popoverRoot)
  }
  onMounted(() => {
    rootPosition.value = getRect(popoverRoot)
    window.addEventListener('scroll', scrollFn)
    window.addEventListener('resize', scrollFn)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollFn)
    window.removeEventListener('resize', scrollFn)
  })
  const reGet = () => {
    scrollFn()
  }
  return {
    rootPosition,
    popoverRoot,
    reGet
  }
}

function getRect(popoverRoot) {
  const { left, top, width, height } = popoverRoot.value.getBoundingClientRect()
  return { left, top, width, height }
}

export default useRootPosition
