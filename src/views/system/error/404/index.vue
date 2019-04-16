<template>
  <div class="page">
    <p class="page_title">404 page not found</p>
    <el-button class="d2-mt" @click="$router.replace({ path: '/' })">
      返回首页
    </el-button>
  </div>
</template>

<script>
export default {
  beforeEnter (to, from, next) {
    // 拦截处理特殊业务场景
    // 如果, 重定向路由包含__双下划线, 为临时添加路由
    if (/__.*/.test(to.redirectedFrom)) {
      return next(to.redirectedFrom.replace(/__.*/, ''))
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
.page {
  background: #303133;
  background-blend-mode: multiply,multiply;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .page_title {
    font-size: 20px;
    color: #FFF;
  }
}
</style>
