<template>
  <el-dialog :visible.sync="visible" :title="$t('mail.send')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="mailTo" :label="$t('mail.mailTo')">
        <el-input v-model="dataForm.mailTo" :placeholder="$t('mail.mailTo')"/>
      </el-form-item>
      <el-form-item prop="mailCc" :label="$t('mail.mailCc')">
        <el-input v-model="dataForm.mailCc" :placeholder="$t('mail.mailCc')"/>
      </el-form-item>
      <el-form-item prop="params" :label="$t('mail.params')">
        <el-input v-model="dataForm.params" :placeholder="$t('mail.paramsTips')"/>
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
import { isEmail } from '@/common/validate'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        mailTo: '',
        mailCc: '',
        params: ''
      }
    }
  },
  computed: {
    dataRule () {
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.email') })))
        }
        callback()
      }
      return {
        mailTo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$axios.post(
          '/sys/mailtemplate/send',
          this.dataForm,
          { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        ).then(res => {
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
