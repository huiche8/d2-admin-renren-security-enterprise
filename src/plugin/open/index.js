import { open } from '@/utils/window'

export default {
  install (Vue, options) {
    Vue.prototype.$open = open
  }
}
