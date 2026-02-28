<template>
  <div class="app-container">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="序号" width="60" align="center">
        <template v-slot="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="150"
        align="center"
      />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="中图预览" align="center" width="300">
        <template v-slot="{row}">
          <el-image
            :src="row.midImg"
            style="width: 100px"
            fit="fill"
          />
        </template>
      </el-table-column>
      <el-table-column label="大图预览" align="center" width="300">
        <template v-slot="{row}">
          <el-image
            :src="row.bigImg"
            style="width: 100px"
            fit="fill"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template v-slot="{row}">
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
              @click="editBanner(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- edit dialogue -->
    <banner-edit
      :data="banner"
      :visible="editVisible"
      @visibleChange="toggleVisibility"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { fetchBanner, postBanner } from '@/api/banner'
import BannerEdit from './edit.vue'

export default {
  name: 'Banner',
  components: {
    BannerEdit
  },
  data() {
    return {
      tableData: [],
      hideAfter: 2000, // ms
      editVisible: false,
      banner: {}
    }
  },
  created() {
    this.getBanner()
  },
  methods: {
    async getBanner() {
      try {
        const { data } = await fetchBanner()
        console.log(data) // {bigImg, description, id, midImg, title}
        // console.log('urls:', data.flatMap(e => [e.midImg, e.bigImg]))
        this.tableData = data
      } catch (error) {
        this.$message.error(`获取数据失败: ${error.message}`)
      }
    },
    editBanner(data) {
      // console.log('oldBanner:', data)
      this.banner = { ...data }
      this.editVisible = true
    },
    toggleVisibility(visible) {
      this.editVisible = visible
    },
    handleSubmit(newBanner) {
      // console.log('newBanner:', newBanner)
      const index = this.tableData.findIndex(e => e.id === newBanner.id)
      if (index === -1) {
        this.$message.error('未找到对应的 Banner')
        return
      }
      this.tableData[index] = { ...newBanner }
      postBanner(this.tableData).then(res => {
        console.log(res) // {code: 0, msg: '', data: ['url1', 'url2', 'url3']}
        this.editVisible = false
        this.$message.success('上传成功')
        this.getBanner() // 刷新表格数据
      })
    }
  }
}
</script>

<style lang="sass" scoped></style>
