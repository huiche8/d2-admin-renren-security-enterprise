<template>
  <d2-container class="mod-sys__menu">
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="$hasPermission('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="mini"
      v-loading="dataListLoading"
      :data="dataList"
      border
      row-key="id"
      style="width: 100%;">
      <table-tree-column prop="name" :label="$t('menu.name')" header-align="center" width="150"/>
      <el-table-column prop="icon" :label="$t('menu.icon')" header-align="center" align="center">
        <template slot-scope="scope">
          <d2-icon-svg class="icon-svg" v-if="scope.row.icon" :name="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="$t('menu.type')" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="mini">{{ $t('menu.type0') }}</el-tag>
          <el-tag v-else size="mini" type="info">{{ $t('menu.type1') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" :label="$t('menu.sort')" header-align="center" align="center"/>
      <el-table-column prop="url" :label="$t('menu.url')" header-align="center" align="center" width="150" :show-overflow-tooltip="true" />
      <el-table-column prop="permissions" :label="$t('menu.permissions')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"/>
      <el-table-column  :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button v-if="$hasPermission('sys:menu:update')" type="text" size="mini" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
          <el-button v-if="$hasPermission('sys:menu:delete')" type="text" size="mini" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './menu-add-or-update'
export default {
  mixins: [ mixinViewModule ],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/menu/list',
        deleteURL: '/sys/menu'
      }
    }
  },
  components: {
    TableTreeColumn,
    AddOrUpdate
  }
}
</script>
