import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue-demi'

function useTrigger(popoverRoot, tipRoot, trigger) {
  const visible = ref(false)
  let timer = null
  function globalFn() {
    if (trigger === 'click') {
      visible.value = false
    }
  }
  onMounted(() => {
    popoverRoot.value.addEventListener('click', () => {
      if (trigger !== 'click' && trigger !== 'manual') return false
      visible.value = !visible.value
    })
    popoverRoot.value.addEventListener('mouseover', () => {
      if (trigger !== 'hover') return false
      clearInterval(timer)
      visible.value = true
    })
    popoverRoot.value.addEventListener('mouseleave', () => {
      if (trigger !== 'hover') return false
      timer = setTimeout(() => {
        visible.value = false
      }, 200)
    })
    popoverRoot.value.addEventListener('mousedown', () => {
      if (trigger !== 'focus') return false
      visible.value = true
    })
    popoverRoot.value.addEventListener('mouseup', () => {
      if (trigger !== 'focus') return false
      visible.value = false
    })
    document.addEventListener('click', globalFn, false)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', globalFn, false)
  })

  watch(
    () => visible.value,
    (v) => {
      if (!v) return false
      nextTick(() => {
        tipRoot.value.addEventListener('mouseover', () => {
          if (trigger !== 'hover') return false
          clearInterval(timer)
          visible.value = true
        })
        tipRoot.value.addEventListener('mouseleave', () => {
          if (trigger !== 'hover') return false
          timer = setTimeout(() => {
            visible.value = false
          }, 200)
        })
      })
    }
  )
  return visible
}

export default useTrigger
