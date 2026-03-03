<template>
  <div class="upload-container">
    <span class="title">{{ title }}</span>
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :headers="headers"
    >
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      validMIMEType: [
        'image/jpeg',
        'image/png',
        'image/x-icon', // ico 格式的一种 MIME 类型
        'image/vnd.microsoft.icon', // ico 格式的另一种 MIME 类型
        'image/ico' // 某些系统可能使用的 ico MIME 类型
      ]
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    }
  },
  methods: {
    handleAvatarSuccess(res) {
      console.log('res:', res) // {code: 0, msg: '', data: '/static/upload/2026-2-26-15-53-2-579-0fa8d.jpg'}
      this.$emit('input', res.data) // 将上传成功的图片URL传递给父组件
    },
    beforeAvatarUpload(file) {
      const validMIME = this.validMIMEType.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!validMIME) {
        this.$message.error('只能上传 JPG/PNG/ICO 格式的图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return validMIME && isLt2M
    }
  }
}
</script>

<style scoped>
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
::v-deep .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.title {
  margin: 15px 0;
  font-weight: 100;
}
</style>
