<template>
  <div class="msg-list-container">
    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%" fit border highlight-current-row>
      <el-table-column prop="id" label="序号" width="60" align="center">
        <template v-slot="item"><span>{{ item.$index + 1 }}</span></template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像" align="center" width="100">
        <template v-slot="{ row }"><el-avatar :src="row.avatar" /></template>
      </el-table-column>
      <el-table-column prop="title" label="昵称" align="center" width="300">
        <template v-slot="{ row }">{{ row.nickname }}</template>
      </el-table-column>
      <el-table-column prop="content" label="内容" align="center">
        <template v-slot="{row}">{{ row.content }}</template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建日期" align="center" width="300">
        <template v-slot="{ row }">{{ row.createDate | formatDate }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130">
        <template v-slot="{ row }">
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
              @click="removeMessage(row)"
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
import { parseTime } from '@/utils'
import { getPagedMessages, delMessage } from '@/api/message'
const formatDate = ts => parseTime(ts, '{y}-{m}-{d} {h}:{i}:{s} 星期{a}')

export default {
  name: 'MessageList',
  filters: {
    formatDate
  },
  data() {
    return {
      loading: false,
      tableData: [],
      hideAfter: 2000,
      total: 0,
      page: 1,
      limit: 10,
      sizes: [5, 10, 20]
    }
  },
  created() {
    this.fetchComments()
  },
  methods: {
    handleSizeChange(newSize) {
      this.limit = newSize
      this.page = 1
      this.fetchComments()
    },
    handleCurrentChange(newPage) {
      // console.log('handleCurrentChange triggered')
      this.page = newPage
      this.fetchComments()
    },
    fetchComments() {
      this.loading = true
      return getPagedMessages(this.page, this.limit).then(({ data }) => {
        this.tableData = data && data.rows || []
        this.total = data && data.total || 0
      }).catch(err => {
        this.$message.error('获取留言板分页列表失败：' + err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    removeMessage(row) {
      this.loading = true
      this.$confirm('确定要删除该留言吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          console.log('before: page, tableData.length', this.page, this.tableData.length) // 2 1
          delMessage(row.id).then(async() => {
            this.$message.success('留言已删除')
            console.log('critical point:', this.page, this.tableData.length) // 2 1, same as before
            await this.fetchComments()
            this.loading = false
            // 当前页仅剩一条数据，删除后会导致当前页没有数据，此时需要让页码回退到上一页
            console.log('after: page, tableData.length', this.page, this.tableData.length) // 1 0
            if (this.tableData.length === 0) {
              console.log('running edge case')
              this.fetchComments()
            }
          }).catch(err => {
            this.$message.error('删除留言失败' + err.message)
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.msg-list-container {
  padding: 20px;
}
</style>
