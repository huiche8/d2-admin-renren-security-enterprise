export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {}
  },
  mutations: {
    /**
     * @description 设置用户信息
     * @param {Object} state vuex state
     * @param {Boolean} active active
     */
    set (state, info) {
      // store 赋值
      state.info = info
    }
  }
}
