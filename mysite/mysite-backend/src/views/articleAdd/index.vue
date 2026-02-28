<template>
  <div class="article-detail-container">
    <el-form ref="blogForm" v-loading="loading" :model="data" :rules="rules">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="data.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="文章编辑">
        <editor
          ref="toastuiEditor"
          :initial-value="data.content"
          :options="editorOptions"
          height="500px"
          initial-edit-type="markdown"
          preview-style="vertical"
        />
      </el-form-item>

      <el-form-item label="文章描述" prop="description">
        <el-input
          v-model="data.description"
          type="textarea"
          rows="5"
          placeholder="请输入文章描述内容"
        />
      </el-form-item>

      <el-form-item label="文章头图">
        <upload v-model="data.thumb" style="width: fit-content" />
      </el-form-item>

      <el-form-item label="选择分类" prop="categoryId">
        <el-select v-model="data.categoryId" placeholder="请选择文章分类">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">发布文章</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-cn'
import { Editor } from '@toast-ui/vue-editor'
import Upload from '@/components/Upload'
import { getBlogCategories } from '@/api/blogCategory'
import { addBlog } from '@/api/blog'

export default {
  name: 'ArticleAdd',
  components: {
    Editor,
    Upload
  },
  data() {
    return {
      loading: false,
      data: {
        title: '',
        content: '',
        description: '',
        thumb: '',
        categoryId: null
      },
      categories: [],
      editorOptions: {
        language: 'zh-CN'
      },
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        description: [{ required: true, message: '请输入文章描述', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择文章分类', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchCategories()
  },
  methods: {
    async fetchCategories() {
      const res = await getBlogCategories()
      // console.log(res, "res"); // {code: 0, msg: '', data: [{name: 'CSS', order: 1, articleCount: 1, id: 'xxx'}]}
      this.categories = res.data
    },
    submitForm() {
      this.$refs.blogForm.validate((valid) => {
        if (valid) {
          this.publishArticle()
        } else {
          this.$message.error('请完善表单信息')
          return false
        }
      })
    },
    publishArticle() {
      /* body: {
        title: '',
        description: '',
        createDate: 1234567890,
        categoryId: 'xxx',
        toc: [],
        htmlContent: '',
        thumb: ''
      } */
      console.log('文章数据:', this.data)
      const params = {
        title: this.data.title,
        description: this.data.description,
        categoryId: this.data.categoryId,
        thumb: this.data.thumb,
        htmlContent: this.$refs.toastuiEditor.invoke('getHTML'),
        // 后台将根据 markdownContent 生成 toc
        markdownContent: this.$refs.toastuiEditor.invoke('getMarkdown')
      }
      this.loading = true
      addBlog(params)
        .then((res) => {
          console.log(res, 'article result') // {code: 0, msg: '', data: {id: 'xxx'}}
          this.$message.success('文章发布成功')
          this.$router.push('/article/list')
        })
        .catch((err) => {
          console.error(err)
          this.$message.error('文章发布失败:' + err.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
.article-detail-container {
  padding: 20px;
}
::v-deep .el-form-item__label {
  float: none;
  font-size: 1em;
  font-weight: 100;
  user-select: none;
}
::v-deep .el-form-item__label::after {
  content: ":";
  clear: right;
}
</style>
