<template>
  <d2-container class="mod-sys__log-error">
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="mini"
      v-loading="dataListLoading"
      :data="dataList"
      border
      @sort-change="dataListSortChangeHandle"
      style="width: 100%;">
      <el-table-column prop="requestUri" :label="$t('logError.requestUri')" header-align="center" align="center"/>
      <el-table-column prop="requestMethod" :label="$t('logError.requestMethod')" header-align="center" align="center"/>
      <el-table-column prop="requestParams" :label="$t('logError.requestParams')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"/>
      <el-table-column prop="ip" :label="$t('logError.ip')" header-align="center" align="center"/>
      <el-table-column prop="userAgent" :label="$t('logError.userAgent')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"/>
      <el-table-column prop="createDate" :label="$t('logError.createDate')" sortable="custom" header-align="center" align="center" width="180"/>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="infoHandle(scope.row.errorInfo)">{{ $t('logError.errorInfo') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      slot="footer"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle">
    </el-pagination>
  </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [ mixinViewModule ],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/log/error/page',
        getDataListIsPage: true,
        exportURL: '/sys/log/error/export'
      }
    }
  },
  methods: {
    // 异常信息
    infoHandle (info) {
      this.$alert(info, this.$t('logError.errorInfo'), {
        customClass: 'mod-sys__log-error-view-info'
      })
    }
  }
}
</script>

<style lang="scss">
.mod-sys__log-error {
  &-view-info {
    width: 80%;
  }
}
</style>
