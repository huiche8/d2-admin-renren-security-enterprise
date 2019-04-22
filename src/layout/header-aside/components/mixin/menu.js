import { open } from '@/common/window'

export default {
  methods: {
    handleMenuSelect (index, indexPath) {
      if (/^d2-menu-empty-\d+$/.test(index) || index === undefined) {
        this.$message.warning('临时菜单')
      } else if (/^https:\/\/|http:\/\//.test(index)) {
        open(index)
      } else {
        // renren
        var route = window.SITE_CONFIG['dynamicMenuRoutes'].filter(item => item.meta.menuId === index)[0]
        if (route) {
          this.$router.push({ name: route.name })
        }
      }
    }
  }
}
