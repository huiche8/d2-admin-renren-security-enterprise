<template>
  <d2-container>
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" :placeholder="$t('running.id')" clearable/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.definitionKey" :placeholder="$t('running.definitionKey')" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="mini"
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;">
      <el-table-column prop="processInstanceId" :label="$t('running.id')" header-align="center" align="center"/>
      <el-table-column prop="processDefinitionKey" :label="$t('running.definitionKey')" header-align="center" align="center"/>
      <el-table-column prop="processDefinitionId" :label="$t('running.processDefinitionId')" header-align="center" align="center"/>
      <el-table-column prop="processDefinitionName" :label="$t('running.processDefinitionName')" header-align="center" align="center"/>
      <el-table-column prop="activityId" :label="$t('running.activityId')" header-align="center" align="center"/>
      <el-table-column prop="suspended" :label="$t('running.suspended')" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.suspended" size="mini">{{ $t('running.suspended1') }}</el-tag>
          <el-tag v-else size="mini" type="danger">{{ $t('running.suspended0') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="deleteHandle(scope.row.processInstanceId)">{{ $t('delete') }}</el-button>
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
        getDataListURL: '/act/running/page',
        getDataListIsPage: true,
        deleteURL: '/act/running'
      },
      dataForm: {
        id: '',
        definitionKey: ''
      }
    }
  }
}
</script>
