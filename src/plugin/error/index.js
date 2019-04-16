import store from '@/store'
import { capsuleLog, dangerLog } from '@/common/log'

export default {
  install (Vue, options) {
    Vue.config.errorHandler = function (error, instance, info) {
      Vue.nextTick(() => {
        // store 追加 log
        store.dispatch('d2admin/log/push', {
          message: `${info}: ${error.message}`,
          type: 'danger',
          meta: {
            error,
            instance
          }
        })
        // 只在开发模式下打印 log
        if (process.env.NODE_ENV === 'development') {
          capsuleLog('D2Admin', 'ErrorHandler', 'danger')
          dangerLog('>>>>>> 错误信息 >>>>>>')
          console.log(info)
          dangerLog('>>>>>> Vue 实例 >>>>>>')
          console.log(instance)
          dangerLog('>>>>>> Error >>>>>>')
          console.log(error)
        }
      })
    }
  }
}
