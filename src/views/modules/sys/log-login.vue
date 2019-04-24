<template>
  <d2-container>
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.creatorName" :placeholder="$t('logLogin.creatorName')" clearable/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" :placeholder="$t('logLogin.status')" clearable>
          <el-option :label="$t('logLogin.status0')" :value="0"/>
          <el-option :label="$t('logLogin.status1')" :value="1"/>
          <el-option :label="$t('logLogin.status2')" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
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
      <el-table-column prop="creatorName" :label="$t('logLogin.creatorName')" header-align="center" align="center"/>
      <el-table-column prop="operation" :label="$t('logLogin.operation')" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.operation === 0 ? $t('logLogin.operation0') : $t('logLogin.operation1') }}
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('logLogin.status')" sortable="custom" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="mini" type="danger">{{ $t('logLogin.status0') }}</el-tag>
          <el-tag v-else-if="scope.row.status === 1" size="mini" type="success">{{ $t('logLogin.status1') }}</el-tag>
          <el-tag v-else size="mini" type="warning">{{ $t('logLogin.status2') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" :label="$t('logLogin.ip')" header-align="center" align="center"/>
      <el-table-column prop="userAgent" :label="$t('logLogin.userAgent')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"/>
      <el-table-column prop="createDate" :label="$t('logLogin.createDate')" sortable="custom" header-align="center" align="center" width="180"/>
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
        getDataListURL: '/sys/log/login/page',
        getDataListIsPage: true,
        exportURL: '/sys/log/login/export'
      },
      dataForm: {
        creatorName: '',
        status: ''
      }
    }
  }
}
</script>
