<template>
  <el-tooltip
    effect="dark"
    :content="$t('layout.tooltip.search')"
    placement="bottom">
    <el-button class="d2-mr btn-text can-hover" type="text" @click="handleClick">
      <d2-icon name="search" style="font-size: 18px;"/>
    </el-button>
  </el-tooltip>
</template>

<script>
export default {
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>
