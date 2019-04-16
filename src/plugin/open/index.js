import { open } from '@/common/window'

export default {
  install (Vue, options) {
    Vue.prototype.$open = open
  }
}
