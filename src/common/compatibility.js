// 兼容工具

/**
 * 将人人后台返回的菜单数据转换为 D2Admin 使用的菜单数据
 * @param {Array} renrenMenu 人人后台返回的菜单数据
 */
export function renrenMenuToD2AdminMenu (renrenMenu = []) {
  console.log('renrenMenu', renrenMenu)
  // 人人的菜单数据和 D2Admin 菜单数据的区别
  // 人人菜单会出现 children.length = 0
  // 人人的菜单使用 name 字段表示菜单名称 而不是 title
  function transform (menu) {
    console.log('menu', menu)
    return {
      ...menu.url ? { path: menu.url } : {},
      title: menu.name,
      // icon: menu.icon,
      ...menu.children.length > 0 ? { children: menu.children.map(e => transform(e)) } : {}
    }
  }
  return renrenMenu.map(e => transform(e))
}
