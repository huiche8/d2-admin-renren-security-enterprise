export default {
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: {
    search: {
      open: 's',
      close: 'esc'
    }
  },
  // 侧边栏默认折叠状态
  menu: {
    asideCollapse: false
  },
  // 在读取持久化数据失败时默认页面
  page: {
    opened: [
      {
        name: 'index',
        fullPath: '/index',
        meta: {
          title: '首页',
          auth: false
        }
      }
    ]
  },
  // renren | window.SITE_CONFIG['contentTabDefault'] 内容标签页默认属性对象
  contentTabDefault: {
    'name': '', // 名称, 由 this.$route.name 自动赋值（默认，名称 === 路由名称 === 路由路径）
    'params': {}, // 参数, 由 this.$route.params 自动赋值
    'query': {}, // 查询参数, 由 this.$route.query 自动赋值
    'menuId': '', // 菜单id（用于选中侧边栏菜单，与this.$store.state.sidebarMenuActiveName进行匹配）
    'title': '', // 标题
    'isTab': true, // 是否通过tab展示内容?
    'iframeURL': '' // 是否通过iframe嵌套展示内容? (以http[s]://开头, 自动匹配)
  },
  // 菜单搜索
  search: {
    enable: true
  },
  // 注册的主题
  theme: {
    list: [
      {
        title: 'd2admin 经典',
        name: 'd2',
        preview: 'image/theme/d2/preview@2x.png'
      },
      {
        title: '紫罗兰',
        name: 'violet',
        preview: 'image/theme/violet/preview@2x.png'
      },
      {
        title: '简约线条',
        name: 'line',
        backgroundImage: 'image/theme/line/bg.jpg',
        preview: 'image/theme/line/preview@2x.png'
      },
      {
        title: '流星',
        name: 'star',
        backgroundImage: 'image/theme/star/bg.jpg',
        preview: 'image/theme/star/preview@2x.png'
      },
      {
        title: 'Tomorrow Night Blue (vsCode)',
        name: 'tomorrow-night-blue',
        preview: 'image/theme/tomorrow-night-blue/preview@2x.png'
      }
    ]
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  }
}
