// 对应人人版本的全局变量

// window.SITE_CONFIG['version'] 替换为 process.env.VUE_APP_VERSION
// window.SITE_CONFIG['apiURL'] 替换为 process.env.VUE_APP_API
// window.SITE_CONFIG['storeState'] 废弃 重置 state 改为指定清理
// window.SITE_CONFIG['contentTabDefault'] = setting.contentTabDefault

export default {
  namespaced: true,
  state: {
    // 左侧菜单列表（后台返回，未做处理）
    menuList: [],
    // 页面按钮操作权限（后台返回，未做处理）
    permissions: [],
    // 动态路由列表
    dynamicRoutes: [],
    // 动态(菜单)路由列表
    dynamicMenuRoutes: [],
    // 动态(菜单)路由是否已经添加的状态标示（用于判断是否需要重新拉取数据并进行动态添加操作）
    dynamicMenuRoutesHasAdded: false
  }
}
