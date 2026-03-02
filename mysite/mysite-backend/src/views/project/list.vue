<template>
  <div class="project-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
      border
      fit
      highlight-current-row
    >
      <el-table-column prop="id" label="序号" width="60" align="center">
        <template
          v-slot="item"
        ><span>{{ item.$index + 1 }}</span></template>
      </el-table-column>
      <el-table-column prop="name" label="项目名称" align="center" width="300">
        <template v-slot="{ row }">
          <el-link :underline="false" target="_blank" :href="row.url">{{
            row.name
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="项目描述">
        <template v-slot="{ row }">
          <p v-for="(desc, idx) in row.description" :key="idx">{{ desc }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="thumb" label="预览图" width="200" align="center">
        <template v-slot="{ row }">
          <el-image
            style="width: 100px; height: 60px"
            :src="row.thumb"
            :preview-src-list="[row.thumb]"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="GitHub"
            placement="top"
            :hide-after="hideAfter"
          >
            <el-button
              circle
              size="mini"
              class="btn-gh"
              @click="gotoGithub(row)"
            >
              <svg-icon icon-class="github" class-name="gh" />
            </el-button>
          </el-tooltip>
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
              @click="edit(row)"
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
              @click="delProj(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <project-edit
      :data="projectData"
      :visible="editVisible"
      @update:visible="toggleVisibility"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { getProjects, delProject, editProject } from '@/api/project'
import ProjectEdit from './edit.vue'
import { checkImage } from '@/utils'

export default {
  name: 'ProjectList',
  components: {
    ProjectEdit
  },
  data() {
    return {
      tableData: [],
      loading: false,
      hideAfter: 2000, // tooltip 消失时间
      thumb:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      projectData: {
        id: '',
        name: '',
        description: [],
        thumb: '',
        order: 1,
        url: '',
        github: ''
      },
      editVisible: false
    }
  },
  created() {
    this.fetchProjects()
  },
  methods: {
    gotoGithub(row) {
      if (row.github) {
        window.open(row.github, '_blank')
      } else {
        this.$message.warning('该项目没有 GitHub 链接')
      }
    },
    handleSubmit(data) {
      // 这里可以调用 API 更新项目数据
      this.loading = true
      editProject(data)
        .then(() => {
          this.$message.success('项目更新成功')
          this.fetchProjects() // 刷新列表
          this.toggleVisibility(false) // 关闭编辑组件
        })
        .catch((err) => {
          console.error('更新项目失败:', err)
          this.$message.error('更新项目失败: ' + err.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    toggleVisibility(visible) {
      this.editVisible = visible
    },
    edit(row) {
      this.projectData = { ...row } // 传递当前行数据到编辑组件
      this.editVisible = true // 显示编辑组件
    },
    delProj({ id }) {
      this.$confirm('确定要删除该项目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delProject(id)
            .then(() => {
              this.$message.success('删除成功')
              this.fetchProjects() // 刷新列表
            })
            .catch((err) => {
              console.error('删除项目失败:', err)
              this.$message.error('删除项目失败: ' + err.message)
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    async fetchProjects() {
      this.loading = true
      try {
        const { data } = await getProjects()
        console.log('project list:', data)
        for (const d of data) {
          d.desc = Array.isArray(d.description) ? d.description.join(',') : '' // 将 description 数组转换为字符串
          d.thumb = (await checkImage(d.thumb)) ? d.thumb : this.thumb // 检查图片链接是否有效，无效则使用默认图片
        }
        this.tableData = [...data] // 假设返回的数据在 response.data 中
      } catch (err) {
        console.error('获取项目列表失败:', err)
        this.$message.error('获取项目列表失败: ' + err.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gh {
  transform: scale(1.2);
}
.btn-gh {
  color: white;
  background-color: rgb(163, 163, 163);
  border-color: rgb(163, 163, 163);
}
</style>
