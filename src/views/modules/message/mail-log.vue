<template>
  <d2-container>
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.templateId" :placeholder="$t('mail.templateId')" clearable/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.mailTo" :placeholder="$t('mail.mailTo')" clearable/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" :placeholder="$t('mail.status')" clearable>
          <el-option :label="$t('mail.status1')" :value="1"/>
          <el-option :label="$t('mail.status0')" :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      size="mini"
      v-loading="dataListLoading"
      :data="dataList"
      border
      @selection-change="dataListSelectionChangeHandle"
      @sort-change="dataListSortChangeHandle"
      style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"/>
      <el-table-column prop="templateId" :label="$t('mail.templateId')" sortable="custom" header-align="center" align="center"/>
      <el-table-column prop="mailFrom" :label="$t('mail.mailFrom')" header-align="center" align="center"/>
      <el-table-column prop="mailTo" :label="$t('mail.mailTo')" header-align="center" align="center"/>
      <el-table-column prop="mailCc" :label="$t('mail.mailCc')" header-align="center" align="center"/>
      <el-table-column prop="subject" :label="$t('mail.subject')" header-align="center" align="center"/>
      <el-table-column prop="status" :label="$t('mail.status')" sortable="custom" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="mini">{{ $t('mail.status1') }}</el-tag>
          <el-tag v-else size="mini" type="danger">{{ $t('mail.status0') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" :label="$t('mail.createDate')" sortable="custom" header-align="center" align="center" width="180"/>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
        getDataListURL: '/sys/maillog/page',
        getDataListIsPage: true,
        deleteURL: '/sys/maillog',
        deleteIsBatch: true
      },
      dataForm: {
        templateId: '',
        mailTo: '',
        status: null
      }
    }
  }
}
</script>
