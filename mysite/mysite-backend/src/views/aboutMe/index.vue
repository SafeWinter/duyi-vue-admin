<template>
  <div class="about-container">
    <el-form
      ref="formRef"
      :inline="true"
      :model="formData"
      :rules="rules"
      @submit.native.prevent
    >
      <el-form-item label="站点 URL" prop="url">
        <el-input
          ref="refAboutMe"
          v-model="formData.url"
          class="about-me"
          :disabled="disabled"
          placeholder="请输入站点 URL"
          @keyup.enter.native="onSubmit"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" :loading="loading" @click="onSubmit">{{ btnLabel }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAbout, editAbout } from '@/api/about'

export default {
  name: 'AboutMe',
  data() {
    return {
      formData: {
        url: ''
      },
      disabled: true,
      loading: false,
      rules: {
        url: [
          { required: true, message: '请输入站点 URL', trigger: 'blur' },
          { type: 'url', message: '请输入正确的 URL', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    btnLabel() {
      return this.disabled ? '变更' : '完成'
    }
  },
  created() {
    this.fetchAboutInfo()
  },
  methods: {
    fetchAboutInfo() {
      this.loading = true
      getAbout().then(({ data }) => {
        this.formData.url = data
      }).catch(err => {
        this.$message.error('获取站点信息失败:' + err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    onSubmit() {
      this.disabled = !this.disabled
      if (!this.disabled) {
        this.$nextTick(() => this.$refs.refAboutMe.focus())
        return
      }

      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入正确的站点地址')
        }
        // 切换回只读状态时，提交更新请求
        this.loading = true
        editAbout({ url: this.formData.url }).then(() => {
          this.$notify.success({
            message: '站点信息已更新',
            duration: 2000
          })
        }).catch(err => {
          this.$message.error('更新站点信息失败:' + err.message)
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.about-container {
  padding: 20px;
}
.about-me {
  width: 450px;
}
::v-deep .el-form-item__label {
  user-select: none;
}
::v-deep .el-form-item__label::after {
  content: ':';
  clear: right;
}
</style>
