<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.name ? `${$t('layout.hello')} ${info.name}` : ''}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        {{$t('layout.logout')}}
      </el-dropdown-item>
      <el-dropdown-item @click.native="resetPassword">
        <d2-icon name="key" class="d2-mr-5"/>
        {{$t('layout.updatePassword')}}
      </el-dropdown-item>
    </el-dropdown-menu>
    <d2-password-update-dialog v-if="updatePassowrdVisible" ref="updatePassowrd"/>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import d2PasswordUpdateDialog from './components/password-update'
export default {
  components: {
    d2PasswordUpdateDialog
  },
  data () {
    return {
      updatePassowrdVisible: false
    }
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    resetPassword () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    }
  }
}
</script>
