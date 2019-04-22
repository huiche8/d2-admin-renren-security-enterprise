import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import { renrenMenuToD2AdminMenu } from '@/common/compatibility'
import { sysMenuService } from '@/common/api'
import { isURL } from '@/common/validate'

Vue.use(VueRouter)

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
      store.commit('d2admin/menu/asideSet', renrenMenuToD2AdminMenu(res))
      fnAddDynamicMenuRoutes(window.SITE_CONFIG['menuList'])
      next({
        ...to,
        replace: true
      })
    }).catch(() => {
      next({
        name: 'login'
      })
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
    console.group('fnAddDynamicMenuRoutes')
    console.log(route.path)
    console.groupEnd()
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
    { path: '*', redirect: { name: '404' } }
  ])
  window.SITE_CONFIG['dynamicMenuRoutes'] = routes
  window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = true
}

export default router
