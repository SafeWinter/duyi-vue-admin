<template>
  <el-dialog title="编辑博客分类" :visible.sync="visible">
    <el-form :model="data">
      <el-form-item label="分类名称" label-width="120px">
        <el-input v-model="data.name" autocomplete="off" style="width: 60%" />
      </el-form-item>
      <el-form-item label="分类等级" label-width="120px">
        <el-select v-model.number="data.order" placeholder="请选择分类等级1" style="width: 60%">
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
        <el-button type="primary" @click="submitForm">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'CategoryEdit',
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
      this.$emit('update:visible', false)
    },
    submitForm() {
      this.$emit('submit', this.data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
