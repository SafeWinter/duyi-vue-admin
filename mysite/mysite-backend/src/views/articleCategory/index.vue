<template>
  <div class="category-list">
    <el-input
      v-model="input"
      placeholder="请输入要添加的分类，左边选择该分类等级"
      class="input-with-select"
    >
      <el-select
        slot="prepend"
        v-model.number="order"
        placeholder="请选择分类等级"
      >
        <el-option label="一级" :value="1" />
        <el-option label="二级" :value="2" />
        <el-option label="三级" :value="3" />
        <el-option label="四级" :value="4" />
        <el-option label="五级" :value="5" />
      </el-select>
    </el-input>
    <el-button class="btn-add" type="primary" @click="addCategory">
      添加
    </el-button>
    <!-- 分类表格 -->
    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="序号" width="60" align="center">
        <template v-slot="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="博客类别" align="center" />
      <el-table-column prop="articleCount" label="文章数量" />
      <el-table-column label="操作" align="center" width="150">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="hideAfter"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editCategory(row)"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="hideAfter"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteCategory(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- edit dialogue -->
    <category-edit
      :data="category"
      :visible="editVisible"
      @update:visible="toggleVisibility"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import CategoryEdit from './edit.vue'
import {
  addCategory,
  delCategory,
  updateCategory,
  getBlogCategories
} from '@/api/blogCategory'

export default {
  name: 'ArticleCategory',
  components: {
    CategoryEdit
  },
  data() {
    return {
      input: '',
      order: undefined,
      category: {},
      tableData: [],
      hideAfter: 2000,
      loading: false,
      editVisible: false
    }
  },
  created() {
    this.fetchCategories()
  },
  methods: {
    async handleSubmit(data) {
      this.category = data
      this.loading = true
      await updateCategory({ id: data.id, data })
      await this.fetchCategories() // 刷新列表
      this.editVisible = false
      this.loading = false
    },
    toggleVisibility(visible) {
      this.editVisible = visible
    },
    async addCategory() {
      if (this.input.trim().length === 0) {
        this.$message.error('请输入分类名称')
        return
      }
      if (!this.order) {
        this.$message.error('请选择分类等级')
        return
      }
      this.loading = true
      await addCategory({ name: this.input, order: this.order })
      this.$message.success('添加成功!')
      this.loading = false
      this.input = ''
      this.order = undefined
      this.fetchCategories() // 刷新列表
    },
    async editCategory(data) {
      // 这步可以省略，因为已经有了完整的分类数据：
      // const { data } = await getBlogCategory(id);
      this.category = { ...data }
      this.editVisible = true
    },
    deleteCategory({ id }) {
      this.$confirm(
        '删除该分类后，该分类的所有文章都将变为未分类状态',
        '是否删除该分类？',
        {
          type: 'warning'
        }
      )
        .then(async() => {
          try {
            this.loading = true
            await delCategory(id)
            this.$message.success('删除成功!')
            await this.fetchCategories() // 刷新列表
            this.loading = false
          } catch (err) {
            console.error('Error deleting category:', err)
            this.$message.error('删除失败!' + err.message)
          }
        })
        .catch(() => {
          // 用户取消删除
          this.$message.info('已取消删除')
        })
    },
    async fetchCategories() {
      try {
        const { data } = await getBlogCategories()
        this.tableData = data // { "name": "css", "order": 1, "articleCount": -2, "id": "60e3f4eaafb11203748a0f68" },
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
  }
}
</script>

<style scoped>
.el-select .el-input {
  width: 130px;
}
.input-with-select {
  width: 45%;
  min-width: 500px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.category-list {
  margin: 1em;
}
.el-select {
  width: 150px;
}
.btn-add {
  margin-inline-start: 1em;
}
.el-select-dropdown__item {
  text-align: center;
}
</style>
