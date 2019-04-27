<template>
  <d2-container>
    <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.beanName" :placeholder="$t('schedule.beanName')" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$hasPermission('sys:schedule:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$hasPermission('sys:schedule:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$hasPermission('sys:schedule:pause')" type="danger" @click="pauseHandle()">{{ $t('schedule.pauseBatch') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$hasPermission('sys:schedule:resume')" type="danger" @click="resumeHandle()">{{ $t('schedule.resumeBatch') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$hasPermission('sys:schedule:run')" type="danger" @click="runHandle()">{{ $t('schedule.runBatch') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$hasPermission('sys:schedule:log')" type="success" @click="logHandle()">{{ $t('schedule.log') }}</el-button>
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
      <el-table-column prop="beanName" :label="$t('schedule.beanName')" header-align="center" align="center"/>
      <el-table-column prop="params" :label="$t('schedule.params')" header-align="center" align="center"/>
      <el-table-column prop="cronExpression" :label="$t('schedule.cronExpression')" header-align="center" align="center"/>
      <el-table-column prop="remark" :label="$t('schedule.remark')" header-align="center" align="center"/>
      <el-table-column prop="status" :label="$t('schedule.status')" sortable="custom" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="mini">{{ $t('schedule.status1') }}</el-tag>
          <el-tag v-else size="mini" type="danger">{{ $t('schedule.status0') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="200">
        <template slot-scope="scope">
          <el-button v-if="$hasPermission('sys:schedule:update')" type="text" size="mini" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
          <el-button v-if="$hasPermission('sys:schedule:pause')" type="text" size="mini" @click="pauseHandle(scope.row.id)">{{ $t('schedule.pause') }}</el-button>
          <el-button v-if="$hasPermission('sys:schedule:resume')" type="text" size="mini" @click="resumeHandle(scope.row.id)">{{ $t('schedule.resume') }}</el-button>
          <el-button v-if="$hasPermission('sys:schedule:run')" type="text" size="mini" @click="runHandle(scope.row.id)">{{ $t('schedule.run') }}</el-button>
          <el-button v-if="$hasPermission('sys:schedule:delete')" type="text" size="mini" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
    <!-- 弹窗, 日志列表 -->
    <log v-if="logVisible" ref="log"/>
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
import AddOrUpdate from './schedule-add-or-update'
import Log from './schedule-log'
export default {
  mixins: [ mixinViewModule ],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/schedule/page',
        getDataListIsPage: true,
        deleteURL: '/sys/schedule',
        deleteIsBatch: true
      },
      dataForm: {
        beanName: ''
      },
      logVisible: false
    }
  },
  components: {
    AddOrUpdate,
    Log
  },
  methods: {
    // 暂停
    pauseHandle (id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('schedule.pause') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.put('/sys/schedule/pause', id ? [id] : this.dataListSelections.map(item => item.id)).then(res => {
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 恢复
    resumeHandle (id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('schedule.resume') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.put('/sys/schedule/resume', id ? [id] : this.dataListSelections.map(item => item.id)).then(res => {
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 执行
    runHandle (id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('schedule.run') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$axios.put('/sys/schedule/run', id ? [id] : this.dataListSelections.map(item => item.id)).then(res => {
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 日志列表
    logHandle () {
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.log.init()
      })
    }
  }
}
</script>
