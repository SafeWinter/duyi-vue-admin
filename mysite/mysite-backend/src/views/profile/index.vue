<template>
  <div class="profile-container">
    <el-form
      ref="ruleForm"
      :model="profile"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="profile.name" show-icon="false" placeholder="请输入用户名" class="form-field" />
      </el-form-item>
      <el-form-item label="当前密码" prop="oldLoginPwd">
        <el-input
          v-model="profile.oldLoginPwd"
          type="password"
          placeholder="请输入当前密码"
          autocomplete="off"
          class="form-field"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="loginPwd">
        <el-input
          v-model="profile.loginPwd"
          type="password"
          placeholder="请输入新密码"
          autocomplete="off"
          class="form-field"
        />
      </el-form-item>
      <el-form-item label="新密码确认" prop="checkLoginPwd">
        <el-input
          v-model="profile.checkLoginPwd"
          type="password"
          placeholder="请再次输入新密码"
          autocomplete="off"
          class="form-field"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="editProfile">
          修改
        </el-button>
        <el-button type="danger" @click="$router.push('/')">
          返回
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import store from '@/store'
import { updateProfile } from '@/api/user'

export default {
  name: 'Profile',
  data() {
    const validatePass = ({ message }, value, callback) => {
      if (value === '') {
        callback(new Error(message))
      } else {
        if (this.profile.checkLoginPwd !== '') {
          this.$refs.ruleForm.validateField('checkLoginPwd')
        }
        callback()
      }
    }
    const validatePass2 = ({ message }, value, callback) => {
      if (value === '') {
        callback(new Error(message))
      } else if (value !== this.profile.loginPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      profile: {
        name: '',
        oldLoginPwd: '',
        loginPwd: '',
        checkLoginPwd: ''
      },
      loginId: '',
      loading: false,
      rules: {
        name: [{ message: '请输入用户名', trigger: 'blur' }],
        oldLoginPwd: [
          { required: true, message: '请输入当前密码', trigger: 'blur' }
        ],
        loginPwd: [
          { required: true, validator: validatePass, message: '请输入新密码', trigger: 'blur' }
        ],
        checkLoginPwd: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass2, message: '两次输入密码不一致', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    params() {
      return {
        name: this.profile.name,
        loginId: this.loginId,
        loginPwd: this.profile.loginPwd,
        oldLoginPwd: this.profile.oldLoginPwd
      }
    }
  },
  created() {
    this.fetchLoginUser()
  },
  methods: {
    fetchLoginUser() {
      store.dispatch('user/getInfo').then(({ name, loginId }) => {
        this.profile.name = name
        this.loginId = loginId
      }).catch(err => {
        this.$message.error('获取登录用户信息失败:' + err.message)
      })
    },
    editProfile() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          this.$message.error('请检查输入的内容!')
          return
        }

        // 这里可以调用接口提交修改后的个人信息
        this.loading = true
        updateProfile(this.params).then(data => {
          // 考虑密码不正确的情况
          if (data && typeof data === 'string') {
            const cause = JSON.parse(data) // {code: 406, msg: '旧密码不正确', data: null}
            console.error('修改个人信息失败:', cause)
            throw new Error(cause.msg)
          }

          this.$message.success({
            message: '个人信息修改成功！请重新登录。',
            duration: 2000,
            onClose: () => {
              // 退出登录并跳转到登录页
              store.dispatch('user/logout').then(() => {
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              })
            }
          })
        }).catch(err => {
          this.$message.error('个人信息修改失败:' + err.message)
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
}
.form-field {
  width: 500px;
}
</style>
