<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="序号" width="60" align="center">
        <template v-slot="item">
          <span>{{ item.$index + 1 + prevCount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="文章名称" align="center">
        <template v-slot="{ row }">
          <el-popover
            placement="top-start"
            title="博客预览图"
            width="200"
            trigger="hover"
          >
            <el-link
              slot="reference"
              :underline="false"
              :href="targetUrl(row)"
              target="_blank"
            >
              {{ row.title }}
            </el-link>
            <el-image
              :src="row.thumb"
              :preview-src-list="[row.thumb]"
              style="width: 100px"
              fit="cover"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="文章描述" />
      <el-table-column prop="scanNumber" label="浏览数" align="center" />
      <el-table-column prop="commentNumber" label="评论量" align="center" />
      <el-table-column prop="category" label="所属分类" align="center">
        <template v-slot="{ row }">
          <span>{{ (!!row.category) ? row.category.name : '未分类' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建日期"
        width="230"
        align="center"
      >
        <template v-slot="{ row }">
          <span>{{ row.createDate | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="120">
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
              @click="editArticle(row)"
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
              @click="deleteArticle(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 下面的 total 是【总记录数】，而非【总页数】 -->
    <el-pagination
      layout="prev, pager, next, total, ->, sizes, jumper"
      :total="total"
      :current-page.sync="page"
      :page-size="limit"
      :page-sizes="sizes"
      :style="{ marginTop: '20px' }"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getList, deleteArticle } from '@/api/blog'
import { parseTime } from '@/utils'
import { fe_URL } from '@/config'
const formatDate = ts => parseTime(ts, '{y}-{m}-{d} {h}:{i}:{s} 星期{a}')

export default {
  name: 'ArticleList',
  filters: {
    formatDate
  },
  data() {
    return {
      tableData: [],
      hideAfter: 2000,
      loading: false,
      total: 0,
      page: 1,
      limit: 10,
      sizes: [5, 10, 20],
      tempUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  },
  computed: {
    totalPage() {
      if (this.total === 0) return 0
      return Math.ceil(this.total / this.limit)
    },
    currCount() {
      return this.tableData.length
    },
    prevCount() {
      return (this.page - 1) * this.limit
    }
  },
  created() {
    this.getBlogList()
  },
  methods: {
    handleCurrentChange(newPage) {
      this.page = newPage
      this.getBlogList()
    },
    handleSizeChange(newLimit) {
      this.limit = newLimit
      this.page = 1
      this.getBlogList()
    },
    targetUrl({ id }) {
      return `${fe_URL}/blog/${id}`
    },
    async getBlogList() {
      this.loading = true
      const { data } = await getList(this.page, this.limit)
      this.loading = false
      // console.log(data); // {rows, total}
      // 临时渲染图片，后续需要替换为后端返回的图片 URL
      // data.rows.forEach(r => { r.thumb = this.tempUrl })
      this.tableData = [...data.rows]
      this.total = data.total
    },
    deleteArticle({ id }) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        type: 'warning'
      })
        .then(() => {
          // console.log("delete id:", id);
          this.loading = true
          deleteArticle(id)
            .then(async() => {
              await this.getBlogList()
              this.loading = false
              this.$message.success('删除成功!')

              // 当前页仅剩一条数据，删除后会导致当前页没有数据，此时需要让页码回退到上一页
              if (this.currCount === 0) {
                console.log('running edge case')
                this.page = this.totalPage
                this.loading = true
                await this.getBlogList()
                this.loading = false
              }
            })
            .catch((err) => {
              this.$message.error(`删除失败! ${err.message}`)
              this.loading = false
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    editArticle(row) {
      console.log('target id:', row.id)
      this.$router.push(`/article/edit/${row.id}`)
    }
  }
}
</script>

<style lang="sass" scoped></style>
