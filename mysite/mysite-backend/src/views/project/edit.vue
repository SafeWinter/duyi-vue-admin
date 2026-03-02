<template>
  <div class="proj-edit-container">
    <el-dialog title="编辑项目信息" :visible.sync="visible" fullscreen>
      <el-form ref="projForm" :model="data" :rules="rules">
        <el-form-item label="项目名称" class="form-label" prop="name">
          <el-input v-model="data.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="项目描述" class="form-label" prop="desc">
          <el-input v-model="data.desc" autocomplete="off" />
        </el-form-item>
        <el-form-item label="项目链接" class="form-label" prop="url">
          <el-input v-model="data.url" autocomplete="off" />
        </el-form-item>
        <el-form-item label="GitHub 地址" class="form-label" prop="github">
          <el-input v-model="data.github" autocomplete="off" />
        </el-form-item>
        <el-form-item label="预览图地址" class="form-label">
          <Upload v-model="data.thumb" style="width: fit-content" />
        </el-form-item>
        <el-form-item label="排序等级" prop="order">
          <el-select v-model.number="data.order" placeholder="请选择排序等级">
            <el-option label="一级" :value="1" />
            <el-option label="二级" :value="2" />
            <el-option label="三级" :value="3" />
            <el-option label="四级" :value="4" />
            <el-option label="五级" :value="5" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="hideEditForm">取 消</el-button>
          <el-button type="primary" @click="submitForm"> 确 定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload'

export default {
  name: 'ProjectEdit',
  components: {
    Upload
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入项目描述', trigger: 'blur' }],
        url: [{ required: true, message: '请输入项目链接', trigger: 'blur' }],
        github: [{ required: true, message: '请输入 GitHub 地址', trigger: 'blur' }],
        order: [
          { required: true, message: '请选择排序等级', trigger: 'change' },
          { type: 'number', min: 1, max: 5, message: '排序等级必须在 1 到 5 之间', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    hideEditForm() {
      this.$emit('update:visible', false)
    },
    submitForm() {
      if (this.data.desc.indexOf(',') !== -1) {
        this.data.description = this.data.desc.split(',') // 将字符串转换为数组
      } else {
        this.data.description = [this.data.desc] // 直接使用字符串或放入数组
      }

      this.$refs.projForm.validate((valid, fields) => {
        if (!valid) {
          console.log('表单验证失败', fields)
          this.$message.error('请检查表单输入是否正确')
          return false
        }

        this.$emit('submit', this.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
  float: none;
  font-size: 1em;
  user-select: none;
}
::v-deep .el-form-item__label::after {
  content: ":";
  clear: right;
}
</style>
