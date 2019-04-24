<template>
  <d2-container>
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.title" :placeholder="$t('news.title')" clearable/>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="daterange"
          type="daterange"
          value-format="yyyy-MM-dd"
          :range-separator="$t('datePicker.range')"
          :start-placeholder="$t('datePicker.start')"
          :end-placeholder="$t('datePicker.end')">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
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
      <el-table-column prop="title" :label="$t('news.title')" header-align="center" align="center"/>
      <el-table-column prop="pubDate" :label="$t('news.pubDate')" sortable="custom" header-align="center" align="center" width="180"/>
      <el-table-column prop="createDate" :label="$t('news.createDate')" sortable="custom" header-align="center" align="center" width="180"/>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
          <el-button type="text" size="mini" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
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
import AddOrUpdate from './news-add-or-update'
export default {
  mixins: [ mixinViewModule ],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/demo/news/page',
        getDataListIsPage: true,
        deleteURL: '/demo/news',
        deleteIsBatch: true
      },
      daterange: null,
      dataForm: {
        title: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  watch: {
    daterange (val) {
      this.dataForm.startDate = val[0]
      this.dataForm.endDate = val[1]
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
