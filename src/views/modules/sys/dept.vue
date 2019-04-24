<template>
  <d2-container class="mod-sys__dept">
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="$hasPermission('sys:dept:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="mini"
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;">
      <table-tree-column prop="name" :label="$t('dept.name')" header-align="center"/>
      <el-table-column prop="parentName" :label="$t('dept.parentName')" header-align="center" align="center"/>
      <el-table-column prop="sort" :label="$t('dept.sort')" header-align="center" align="center" width="80"/>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button v-if="$hasPermission('sys:dept:update')" type="text" size="mini" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
          <el-button v-if="$hasPermission('sys:dept:delete')" type="text" size="mini" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import TableTreeColumn from '@/components/table-tree-column'
import AddOrUpdate from './dept-add-or-update'
export default {
  mixins: [ mixinViewModule ],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/dept/list',
        deleteURL: '/sys/dept'
      }
    }
  },
  components: {
    TableTreeColumn,
    AddOrUpdate
  }
}
</script>
