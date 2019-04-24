// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// i18n
import i18n, { messages } from '@/i18n'
// axios
import axios from '@/plugin/axios'
import { hasPermission } from '@/common/renren'
// flex 布局库
import 'flex.css'
// 组件
import '@/components'
// svg 图标
import '@/assets/svg-icons'

// 功能插件
import pluginOpen from '@/plugin/open'

export default {
  async install (Vue, options) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // [ renren ] 挂载全局
    Vue.prototype.$axios = axios
    // [ renren ] 挂载全局
    Vue.prototype.$hasPermission = hasPermission
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.BASE_URL
    // 当前版本
    Vue.prototype.$version = process.env.VUE_APP_VERSION
    // 构建时间
    Vue.prototype.$buildTime = process.env.VUE_APP_BUILD_TIME
    // 多国语选项
    Vue.prototype.$languages = Object.keys(messages).map(langlage => ({
      label: messages[langlage]._lang,
      value: langlage
    }))
    // Element
    Vue.use(ElementUI, {
      i18n: (key, value) => i18n.t(key, value)
    })
    // 插件
    Vue.use(pluginOpen)
  }
}
