import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store/index'
import { sysMenuService } from '@/common/api'
import { isURL } from '@/common/validate'

Vue.use(VueRouter)

/**
 * 删除无用的 children 字段以及精简数据
 * @param {Array} menuArray 后台返回的菜单格式
 * @param {Array} routeNameDict renrenMenuToRouteDict 生成的菜单名称和 id 的对照表
 */
function renrenMenuToD2AdminMenu (menuArray, routeNameDict) {
  const transform = menu => ({
    ...menu.children.length > 0 ? { children: menu.children.map(e => transform(e)) } : {},
    id: menu.id,
    icon: menu.icon,
    title: menu.name,
    name: routeNameDict[menu.id]
  })
  return menuArray.map(e => transform(e))
}

/**
 * 将后台返回的数据转化成 d2admin/page/init 使用的数据
 * @param {Array} menuArray 后台返回的菜单格式
 * @param {Array} routeNameDict renrenMenuToRouteDict 生成的菜单名称和 id 的对照表
 * @param {Array} routePathDict renrenMenuToRouteDict 生成的菜单名称和 path 的对照表
 */
function renrenMenuToD2AdminPageInitData (menuArray, routeNameDict, routePathDict) {
  const transform = menu => ({
    ...menu.children.length > 0 ? { children: menu.children.map(e => transform(e)) } : {},
    meta: {
      title: menu.name
    },
    name: routeNameDict[menu.id],
    path: routePathDict[menu.id]
  })
  return menuArray.map(e => transform(e))
}

/**
 * 将后台返回的数据转化成 d2admin/page/init 使用的数据
 * @param {Array} menuArray 后台返回的菜单格式
 * @param {Array} routeNameDict renrenMenuToRouteDict 生成的菜单名称和 id 的对照表
 * @param {Array} routePathDict renrenMenuToRouteDict 生成的菜单名称和 path 的对照表
 */
function renrenMenuToD2AdminSearchInitData (menuArray, routeNameDict, routePathDict) {
  const transform = menu => ({
    ...menu.children.length > 0 ? { children: menu.children.map(e => transform(e)) } : {},
    path: routePathDict[menu.id],
    title: menu.name,
    icon: menu.icon
  })
  return menuArray.map(e => transform(e))
}

/**
 * 将后台传来的菜单数据整理成 [{ id: routeName }] 的键值对数组
 * @param {Array} menuArray 后台返回的菜单格式
 */
function renrenMenuToRouteDict (menuArray, routePropName = 'name') {
  const dict = {}
  const step = menu => {
    var route = window.SITE_CONFIG['dynamicMenuRoutes'].filter(item => item.meta.menuId === menu.id)[0]
    if (route) {
      Object.defineProperty(dict, menu.id, {
        value: route[routePropName]
      })
    }
    if (menu.children.length > 0) {
      menu.children.forEach(step)
    }
  }
  menuArray.forEach(step)
  return dict
}

// 页面路由(独立页面)
export const pageRoutes = [
  {
    path: '/login',
    component: () => import('@/views/d2admin/login'),
    name: 'login',
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    component: () => import('@/views/d2admin/error/404'),
    name: '404',
    meta: {
      title: '404未找到'
    }
  }
]

// 模块路由(基于主入口布局页面)
export const moduleRoutes = {
  path: '/',
  component: () => import('@/layout/header-aside'),
  redirect: { name: 'index' },
  meta: { title: '主入口布局' },
  children: [
    {
      path: '/index',
      component: () => import('@/views/modules/index'),
      name: 'index',
      meta: {
        title: '首页',
        isTab: true
      }
    }
  ]
}

const router = new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: pageRoutes.concat(moduleRoutes)
})

router.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 添加动态(菜单)路由
  // 已添加或者当前路由为页面路由, 可直接访问
  if (window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] || fnCurrentRouteIsPageRoute(to, pageRoutes)) {
    return next()
  }
  // 获取菜单列表, 添加并全局变量保存
  sysMenuService
    .getNav()
    .then(res => {
      window.SITE_CONFIG['menuList'] = res
      fnAddDynamicMenuRoutes(res)
      // 性能优化 提前计算出路由 id 和 route 属性的对照
      const routeNameDict = renrenMenuToRouteDict(res, 'name')
      const routePathDict = renrenMenuToRouteDict(res, 'path')
      store.commit('d2admin/menu/asideSet', renrenMenuToD2AdminMenu(res, routeNameDict))
      store.commit('d2admin/page/init', renrenMenuToD2AdminPageInitData(res, routeNameDict, routePathDict))
      store.commit('d2admin/search/init', renrenMenuToD2AdminSearchInitData(res, routeNameDict, routePathDict))
      next({ ...to, replace: true })
    }).catch(error => {
      console.log('error', error)
      next({ name: 'login' })
    })
})

/**
 * 判断当前路由是否为页面路由
 * @param {*} route 当前路由
 * @param {*} pageRoutes 页面路由
 */
function fnCurrentRouteIsPageRoute (route, pageRoutes = []) {
  var temp = []
  for (var i = 0; i < pageRoutes.length; i++) {
    if (route.path === pageRoutes[i].path) {
      return true
    }
    if (pageRoutes[i].children && pageRoutes[i].children.length >= 1) {
      temp = temp.concat(pageRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteIsPageRoute(route, temp) : false
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
      continue
    }
    // 组装路由
    var route = {
      path: '',
      component: null,
      name: '',
      meta: {
        ...window.SITE_CONFIG['contentTabDefault'],
        menuId: menuList[i].id,
        title: menuList[i].name
      }
    }
    // TODO: 因为下面的 eval(s2) 导致暂时只能使用 window.SITE_CONFIG 全局变量。s2 的值中存在这短代码
    // eslint-disable-next-line
    let URL = (menuList[i].url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      route['path'] = route['name'] = `i-${menuList[i].id}`
      route['meta']['iframeURL'] = URL
    } else {
      URL = URL.replace(/^\//, '').replace(/_/g, '-')
      route['path'] = route['name'] = URL.replace(/\//g, '-')
      route['component'] = () => import(`@/views/modules/${URL}`)
    }
    routes.push(route)
  }
  if (temp.length >= 1) {
    return fnAddDynamicMenuRoutes(temp, routes)
  }
  // 添加路由
  router.addRoutes([
    {
      ...moduleRoutes,
      name: 'main-dynamic-menu',
      children: routes
    },
    {
      path: '*',
      redirect: {
        name: '404'
      }
    }
  ])
  window.SITE_CONFIG['dynamicMenuRoutes'] = routes
  window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = true
}

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
})

export default router
