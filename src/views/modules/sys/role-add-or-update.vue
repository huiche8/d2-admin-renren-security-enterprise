<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" :label="$t('role.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('role.name')"/>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('role.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('role.remark')"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item size="mini" :label="$t('role.menuList')">
            <el-tree
              :data="menuList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="menuListTree"
              accordion
              show-checkbox>
            </el-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item size="mini" :label="$t('role.deptList')">
            <el-tree
              :data="deptList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="deptListTree"
              accordion
              show-checkbox>
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
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
      menuList: [],
      deptList: [],
      dataForm: {
        id: '',
        name: '',
        menuIdList: [],
        deptIdList: [],
        remark: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
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
        this.$refs.menuListTree.setCheckedKeys([])
        this.$refs.deptListTree.setCheckedKeys([])
        Promise.all([
          this.getMenuList(),
          this.getDeptList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 获取菜单列表
    getMenuList () {
      return this.$axios.get('/sys/menu/select').then(res => {
        this.menuList = res
      }).catch(() => {})
    },
    // 获取部门列表
    getDeptList () {
      return this.$axios.get('/sys/dept/list').then(res => {
        this.deptList = res
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$axios.get(`/sys/role/${this.dataForm.id}`).then(res => {
        this.dataForm = {
          ...this.dataForm,
          ...res
        }
        this.dataForm.menuIdList.forEach(item => this.$refs.menuListTree.setChecked(item, true))
        this.$refs.deptListTree.setCheckedKeys(this.dataForm.deptIdList)
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.menuIdList = [
          ...this.$refs.menuListTree.getHalfCheckedKeys(),
          ...this.$refs.menuListTree.getCheckedKeys()
        ]
        this.dataForm.deptIdList = this.$refs.deptListTree.getCheckedKeys()
        this.$axios[!this.dataForm.id ? 'post' : 'put']('/sys/role', this.dataForm).then(res => {
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
