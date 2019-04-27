import { Message, MessageBox } from 'element-ui'
import { cookieSet, cookieRemove } from '@/common/cookie'
import router from '@/router'
import i18n from '@/i18n'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} param context
     * @param {Object} param userInfo 登陆后获得的用户信息
     */
    login ({ dispatch }, userInfo) {
      return new Promise(async resolve => {
        cookieSet('token', userInfo.token)
        // 用户登录后从持久化数据加载一系列的设置
        await dispatch('load')
        // 结束
        resolve()
      })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} param context
     * @param {Object} param confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        cookieRemove('token')
        window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = false
        // 跳转路由
        router.push({
          name: 'login'
        })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm(i18n.t('prompt.logout'), i18n.t('prompt.title'), {
          confirmButtonText: i18n.t('confirm'),
          cancelButtonText: i18n.t('cancel'),
          type: 'warning'
        })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({
              message: i18n.t('message.logoutCancel')
            })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} state vuex state
     */
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载主题
        await dispatch('d2admin/theme/load', null, { root: true })
        // DB -> store 加载页面过渡效果设置
        await dispatch('d2admin/transition/load', null, { root: true })
        // DB -> store 持久化数据加载侧边栏折叠状态
        await dispatch('d2admin/menu/asideCollapseLoad', null, { root: true })
        // end
        resolve()
      })
    }
  }
}
