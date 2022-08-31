export default {
  namespaced: true,
  state() {
    return {
      historys: []
    }
  },
  mutations: {
    // 添加history, 在头部添加、添加的内容不能重复、重复之后要把之前重复的元素删除掉、在在头部添加
    addHistory(state, history) {
      const oldIndex = state.historys.findIndex((item) => item === history)
      if (oldIndex !== -1) {
        state.historys.splice(oldIndex, 1)
      }
      state.historys.unshift(history)
    },
    // 通过索引删除单个history
    removeHistory(state, index) {
      state.historys.splice(index, 1)
    },
    // 移除全部history
    removeAllHistory(state) {
      state.historys = []
    }
  }
}
