<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="dictName" :label="$t('dict.dictName')">
        <el-input v-model="dataForm.dictName" :placeholder="$t('dict.dictName')"/>
      </el-form-item>
      <el-form-item v-if="dataForm.pid === '0'" prop="dictType" :label="$t('dict.dictType')">
        <el-input v-model="dataForm.dictType" :placeholder="$t('dict.dictType')"/>
      </el-form-item>
      <el-form-item v-if="dataForm.pid !== '0'" prop="dictValue" :label="$t('dict.dictValue')">
        <el-input v-model="dataForm.dictValue" :placeholder="$t('dict.dictValue')"/>
      </el-form-item>
      <el-form-item prop="sort" :label="$t('dict.sort')">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :label="$t('dict.sort')"/>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('dict.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('dict.remark')"/>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { debounce } from 'lodash'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        pid: '0',
        dictName: '',
        dictType: '',
        dictValue: '',
        sort: 0,
        remark: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        dictName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$axios.get(`/sys/dict/${this.dataForm.id}`).then(res => {
        this.dataForm = {
          ...this.dataForm,
          ...res
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$axios[!this.dataForm.id ? 'post' : 'put']('/sys/dict', this.dataForm).then(res => {
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
