<template>
  <div class="proj-add-container">
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
      <el-form-item>
        <el-button type="primary" @click="submitForm">发布项目</el-button>
        <el-button type="primary" disabled title="删除 disabled 恢复按钮" @click="testData">测试数据</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import { addProject } from '@/api/project'

const randomDesc = (n = 3) => [
  '这是第一个测试项目的描述',
  '这是第二个测试项目的描述',
  '这是第三个测试项目的描述',
  '这是第四个测试项目的描述',
  '这是第五个测试项目的描述'
].slice(0, n).join(',')

export default {
  name: 'ProjectAdd',
  components: {
    Upload
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
      },
      data: {
        name: '',
        desc: '',
        url: '',
        github: '',
        thumb: '',
        order: 1
      }
    }
  },
  methods: {
    testData() {
      this.data = Object.assign({}, this.data, {
        name: '测试项目' + Math.random().toString(16).slice(2, 6),
        desc: randomDesc(Math.floor(Math.random() * 5) + 1), // 随机生成 1-5 条描述
        url: 'https://github.com/svg/svgo',
        github: 'https://github.com/nhn/tui.editor',
        thumb: '/static/upload/2026-3-1-21-16-58-213-35bc2.jpg',
        order: Math.floor(Math.random() * 5) + 1
      })
    },
    submitForm() {
      this.$refs.projForm.validate((valid) => {
        if (!valid) {
          console.log('表单验证失败')
          this.$message.error('请完善表单信息')
          return false
        }

        // console.log('表单验证通过，准备提交:', this.data);
        // 处理 desc 字段，将逗号分隔的字符串转换为数组
        if (this.data.desc.indexOf(',')) {
          this.data.description = this.data.desc.split(',')
        } else {
          this.data.description = [this.data.desc]
        }

        addProject(this.data)
          .then(() => {
            this.$message.success('项目发布成功')
            this.$router.push('/project/list') // 发布成功后跳转到项目列表页
          })
          .catch((err) => {
            console.error('发布项目失败:', err)
            this.$message.error('发布项目失败: ' + err.message)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.proj-add-container {
  padding: 20px;
}
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
