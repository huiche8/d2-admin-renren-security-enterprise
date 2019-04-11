<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"/>
      </ul>
    </div>
    <div class="page-login--layer page-login--layer-time" flex="main:center cross:center">{{time}}</div>
    <div class="page-login--layer">
      <div class="page-login--content" flex="dir:top main:justify box:justify">
        <div class="page-login--content-header" flex="main:justify box:justify">
          <p class="page-login--content-header-side">
            <span class="page-login--content-header-side-text" style="opacity: 0;"><d2-icon name="language"/> {{ $t('login.language') }}</span>
          </p>
          <p class="page-login--content-header-center">{{ $t('login.motto') }}</p>
          <p class="page-login--content-header-side">
            <el-dropdown size="small" @command="command => $i18n.locale = command">
              <span class="page-login--content-header-side-text"><d2-icon name="language"/> {{ $t('login.language') }}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(language, index) in $languages" :key="index" :command="language.value">{{ language.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
        </div>
        <div class="page-login--content-main" flex="dir:top main:center cross:center">
          <!-- logo -->
          <img class="page-login--logo" src="./image/logo@2x.png">
          <!-- 表单 -->
          <div class="page-login--form">
            <el-card shadow="never">
              <el-form ref="loginForm" label-position="top" :rules="rules" :model="form" size="default">
                <el-form-item prop="username">
                  <el-input type="text" v-model="form.username" :placeholder="$t('login.form.placeholderUsername')">
                    <i slot="prepend" class="fa fa-user-circle-o"/>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" v-model="form.password" :placeholder="$t('login.form.placeholderPassword')">
                    <i slot="prepend" class="fa fa-keyboard-o"/>
                  </el-input>
                </el-form-item>
                <el-form-item prop="captcha">
                  <el-input type="text" v-model="form.captcha" :placeholder="$t('login.form.placeholderCaptcha')">
                    <template slot="append">
                      <div class="login-captcha" :style="{ backgroundImage: `url(${captchaPath})` }" @click="updateUUID"/>
                    </template>
                  </el-input>
                </el-form-item>
                <el-button class="button-login" size="default" type="primary" @click="submit">
                  {{ $t('login.form.textSubmitButton') }}
                </el-button>
              </el-form>
            </el-card>
            <p class="page-login--options" flex="main:justify cross:center">
              <span>
                <d2-icon name="question-circle"/> {{ $t('login.form.textForget') }}
              </span>
              <span>{{ $t('login.form.textSignUp') }}</span>
            </p>
          </div>
        </div>
        <div class="page-login--content-footer">
          <p class="page-login--content-footer-options">
            <a href="#">{{ $t('login.footer.buttonHelp') }}</a>
            <a href="#">{{ $t('login.footer.buttonPrivacy') }}</a>
            <a href="#">{{ $t('login.footer.buttonClause') }}</a>
          </p>
          <p class="page-login--content-footer-copyright">
            {{ $t('login.copyright.p1') }} <d2-icon name="copyright"/> {{ $t('login.copyright.p2') }} <a href="https://github.com/FairyEver">{{ $t('login.copyright.p3') }}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
import { debounce } from 'lodash'
import util from '@/libs/util.js'
import { login } from '@api/sys.login'
export default {
  data () {
    return {
      // 动态背景
      timeInterval: null,
      time: dayjs().format('HH:mm:ss'),
      // 表单
      form: {
        username: 'admin',
        password: 'admin',
        uuid: '',
        captcha: ''
      }
    }
  },
  computed: {
    // 校验规则
    rules () {
      return {
        username: [
          { required: true, message: this.$t('login.ruleMessage.username'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('login.ruleMessage.password'), trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$t('login.ruleMessage.captcha'), trigger: 'blur' }
        ]
      }
    },
    // 验证码图片地址
    captchaPath () {
      return `${process.env.VUE_APP_API}/captcha?uuid=${this.form.uuid}`
    }
  },
  created () {
    // 刷新验证码和 uuid
    this.updateUUID()
  },
  mounted () {
    this.timeInterval = setInterval(this.refreshTime, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login'
    ]),
    /**
     * @description 刷新 uuid
     */
    updateUUID () {
      this.form.uuid = util.renren.getUUID()
    },
    /**
     * @description 刷新后面的时间背景
     */
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    /**
     * @description 提交表单
     */
    submit: debounce(function () {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return
        login(this.form)
          .then(async res => {
            await this.login(res)
            this.$router.replace(this.$route.query.redirect || '/')
          })
          .catch(this.updateUUID)
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>

<style lang="scss">
.page-login {
  @extend %unable-select;
  $backgroundColor: #F0F2F5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-side {
      margin: 0px 20px;
      padding: 0px;
      .page-login--content-header-side-text {
        color: $color-text-normal;
        font-size: 12px;
      }
    }
    .page-login--content-header-center {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      font-size: 12px;
      text-align: center;
    }
  }
  // main
  .page-login--logo {
    width: 240px;
    margin-bottom: 2em;
    margin-top: -2em;
  }
  // 登录表单
  .page-login--form {
    width: 290px;
    // 卡片
    .el-card {
      margin-bottom: 15px;
    }
    // 登录按钮
    .button-login {
      width: 100%;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
    .login-captcha {
      height: 40px - 2px;
      width: 126px;
      background-size: cover;
      background-position: center;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 14px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
