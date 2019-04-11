import util from '@/utils/util'

export default {
  install (Vue, options) {
    Vue.prototype.$open = util.open
  }
}
