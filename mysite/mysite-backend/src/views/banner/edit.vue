<template>
  <el-dialog title="编辑首页标语" :visible.sync="visible" top="10vh">
    <el-form :model="data">
      <el-form-item label="标题">
        <el-input v-model="data.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="data.description"
          type="textarea"
          :rows="5"
          placeholder="请输入描述内容"
        />
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <!-- 中图展示 -->
          <el-form-item label="首页中图">
            <upload v-model="data.midImg" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 大图展示 -->
          <el-form-item label="首页大图">
            <upload v-model="data.bigImg" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="hideEditForm">取 消</el-button>
        <el-button type="primary" @click="submitForm"> 确 定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import Upload from '@/components/Upload'

export default {
  name: 'BannerEdit',
  components: {
    Upload
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hideEditForm() {
      this.$emit('visibleChange', false)
    },
    submitForm() {
      this.$emit('submit', this.data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
