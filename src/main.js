// Vue
import Vue from 'vue'
import App from './App'
// i18n
import i18n from '@/i18n'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'
// [ 可选组件 ]D2-Crud
import D2Crud from '@d2-projects/d2-crud'
// 菜单和路由设置
import router from './router'
// 核心插件
Vue.use(d2Admin)
// 可选插件组件
Vue.use(D2Crud)

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  }
}).$mount('#app')
