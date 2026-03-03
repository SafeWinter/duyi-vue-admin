<template>
  <div class="setting-container">
    <el-divider content-position="left">网站信息</el-divider>
    <el-form
      ref="formSetting"
      :loading="loading"
      :label-position="labelPosition"
      label-width="80px"
      :model="info"
      :disabled="!editMode"
      :rules="rules"
    >
      <el-form-item prop="siteTitle" label="网站标题">
        <el-input v-model="info.siteTitle" class="form-field" />
      </el-form-item>
      <el-form-item prop="mail" label="邮箱">
        <el-input v-model="info.mail" class="form-field" />
      </el-form-item>
      <el-form-item prop="icp" label="备案号">
        <el-input v-model="info.icp" class="form-field" />
      </el-form-item>
      <el-divider content-position="left">网站头像信息</el-divider>
      <el-form-item prop="avatar" label="头像">
        <upload v-model="info.avatar" :class="{noClick: !editMode}" />
      </el-form-item>
      <el-divider content-position="left">网址图标信息</el-divider>
      <el-form-item prop="favicon" label="网址图标地址">
        <el-input v-model="info.favicon" class="form-field" />
      </el-form-item>
      <el-form-item label="网址图标预览">
        <upload v-model="info.favicon" :class="{noClick: !editMode}" />
      </el-form-item>
      <el-divider content-position="left">GitHub 信息</el-divider>
      <el-form-item prop="githubName" label="GiHub 名字">
        <el-input v-model="info.githubName" class="form-field" />
      </el-form-item>
      <el-form-item prop="github" label="GitHub 地址">
        <el-input v-model="info.github" class="form-field" />
      </el-form-item>
      <el-divider content-position="left">QQ 信息</el-divider>
      <el-form-item prop="qq" label="QQ 号码">
        <el-input v-model="info.qq" class="form-field" />
      </el-form-item>
      <el-form-item label="QQ 二维码图片预览">
        <upload v-model="info.qqQrCode" :class="{noClick: !editMode}" />
      </el-form-item>
      <el-divider content-position="left">微信信息</el-divider>
      <el-form-item prop="weixin" label="微信号">
        <el-input v-model="info.weixin" class="form-field" />
      </el-form-item>
      <el-form-item label="微信二维码图片预览">
        <upload v-model="info.weixinQrCode" :class="{noClick: !editMode}" />
      </el-form-item>
      <el-divider />
    </el-form>
    <el-button :loading="loading" type="primary" @click="handleClick">{{ btnLabel }}</el-button>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import { getSetting, editSetting } from '@/api/setting'

export default {
  name: 'Settings',
  components: {
    Upload
  },
  data() {
    return {
      labelPosition: 'top',
      info: {
        siteTitle: '',
        mail: '',
        icp: '',
        avatar: ''
      },
      editMode: false,
      loading: false,
      rules: {
        siteTitle: [
          { required: true, message: '请输入网站标题', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        icp: [
          { required: true, message: '请输入备案号', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '请上传网站头像', trigger: 'change' }
        ],
        githubName: [
          { required: true, message: '请输入 GitHub 名字', trigger: 'blur' }
        ],
        github: [
          { required: true, message: '请输入 GitHub 地址', trigger: 'blur' }
        ],
        qq: [
          { required: true, message: '请输入 QQ 号码', trigger: 'blur' }
        ],
        weixin: [
          { required: true, message: '请输入微信号', trigger: 'blur' }
        ],
        favicon: [
          { required: true, message: '请输入网址图标地址', trigger: 'blur' }
        ],
        qqQrCode: [
          { required: true, message: '请上传 QQ 二维码图片', trigger: 'change' }
        ],
        weixinQrCode: [
          { required: true, message: '请上传微信二维码图片', trigger: 'change' }
        ]

      }
    }
  },
  computed: {
    btnLabel() {
      return this.editMode ? '保存设置' : '进入编辑模式'
    }
  },
  created() {
    this.fetchSettings()
  },
  methods: {
    async fetchSettings() {
      try {
        const { data } = await getSetting()
        this.info = { ...data }
      } catch (error) {
        console.error('获取设置失败:', error)
      }
    },
    async handleClick() {
      this.editMode = !this.editMode
      if (this.editMode) {
        return
      }
      // 仅在点击保存设置时才进行表单验证和提交
      this.$refs.formSetting.validate(async(valid) => {
        if (!valid) {
          this.$message.error('请检查输入项是否正确!')
          this.editMode = true // 保持在编辑模式，允许用户修正输入错误
          return
        }

        try {
          this.loading = true
          await editSetting(this.info)
          this.$message.success('设置保存成功!')
        } catch (error) {
          console.error('保存设置失败:', error)
          this.$message.error('保存设置失败，请稍后再试!')
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$width: 500px;
.setting-container {
  padding: 20px;
}
::v-deep .el-form-item__content {
  width: fit-content;
}
.form-field {
  width: $width;
}
::v-deep .el-divider--horizontal {
  margin-block: 3.5em 1.5em;
}
::v-deep .el-divider--horizontal:first-child {
  margin-block-start: 1.5em;
}
.el-divider__text {
  font-size: 1.5em;
}
::v-deep .el-form-item__label {
  user-select: none;
  font-weight: 100;
  font-size: 1em;
  &::after {
    content: ':';
  }
}
.upload-container {
  width: $width;
  display: flex;
  justify-content: center;
}
.noClick {
  pointer-events: none;
  user-select: none;
}
</style>
