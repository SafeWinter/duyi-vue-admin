<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">个人博客项目后台系统</h3>
      </div>

      <el-form-item prop="loginId">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginId"
          v-model.trim="loginForm.loginId"
          placeholder="请输入用户名"
          name="loginId"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="loginPwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="loginPwd"
          v-model="loginForm.loginPwd"
          :type="passwordType"
          placeholder="请输入登录密码"
          name="loginPwd"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <div class="captcha-container">
        <el-form-item prop="captcha" class="captcha-field">
          <span class="svg-container">
            <svg-icon icon-class="table" />
          </span>
          <el-input
            ref="captchaInput"
            v-model="loginForm.captcha"
            placeholder="请输入验证码"
            name="captcha"
            type="text"
            tabindex="3"
            auto-complete="on"
          />
        </el-form-item>
        <div class="captcha-img" @click="updateCaptcha" v-html="captcha" />
      </div>
      <el-checkbox
        v-model="rememberMe"
        class="remember-me"
      >7 天内免登录</el-checkbox>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px; letter-spacing: 1.5em"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { getCaptcha } from '@/api/captcha'

export default {
  name: 'Login',
  data() {
    const requiredField = ({ message, required }, value, callback) => {
      if (required && !value) {
        callback(new Error(message))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        loginId: '',
        loginPwd: ''
      },
      loginRules: {
        loginId: [
          {
            required: true,
            trigger: 'blur',
            validator: requiredField,
            message: '请输入管理员帐号'
          }
        ],
        loginPwd: [
          {
            required: true,
            trigger: 'blur',
            validator: requiredField,
            message: '请输入登录密码'
          }
          // {
          //   min: 6,
          //   max: 20,
          //   trigger: 'blur',
          //   message: '登录密码长度必须在 6 - 20 之间'
          // }
        ],
        captcha: [
          {
            required: true,
            trigger: 'blur',
            validator: requiredField,
            message: '请输入验证码'
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      captcha: '',
      rememberMe: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.updateCaptcha()
  },
  methods: {
    updateCaptcha() {
      getCaptcha().then((captcha) => {
        this.captcha = captcha
        this.$nextTick(() => this.$refs.captchaInput.focus())
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.loginPwd.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }

        // pass validation, handle login
        this.loading = true
        const loginData = { ...this.loginForm }
        if (this.rememberMe) {
          loginData.remember = 7
        }

        this.$store
          .dispatch('user/login', loginData)
          .then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
            this.$message.success('登录成功！')
          })
          .catch((errMsg) => {
            this.loading = false
            this.$message.error(errMsg)
            this.resetForm()
          })
      })
    },
    resetForm() {
      this.loginForm.captcha = ''
      this.updateCaptcha()
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

.captcha-container {
  display: flex;
  column-gap: 10px;
  align-content: center;
}
.captcha-field {
  width: 70%;
}
.captcha-img {
  height: 52px;
  width: 150px;
  border-radius: 0.15em;
  background-color: #eee;
  cursor: pointer;
}
.remember-me {
  margin-block-end: 1em;
}
</style>
