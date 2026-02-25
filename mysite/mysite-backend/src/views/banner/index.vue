<template>
  <el-table class="app-container" :data="tableData" stripe style="width: 100%">
    <el-table-column prop="id" label="序号" width="60" :align="align">
      <template slot-scope="scope">
        <span>{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="标题" width="150" :align="align"></el-table-column>
    <el-table-column prop="description" label="描述"></el-table-column>
    <el-table-column label="中图预览" :align="align">
      <template slot-scope="scope">
        <el-image
          :src="scope.row.midImg2"
          style="width: 100px"
          fit="fill"
        ></el-image>
      </template>
    </el-table-column>
    <el-table-column label="大图预览" :align="align">
      <template slot-scope="scope">
        <el-image
          :src="scope.row.bigImg2"
          style="width: 100px"
          fit="fill"
        ></el-image>
      </template>
    </el-table-column>
    <el-table-column label="操作" :align="align">
      <template>
        <el-tooltip
          class="item"
          effect="dark"
          content="编辑"
          placement="top"
          :hide-after="hideAfter"
        >
          <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchBanner } from "@/api/banner";
import { server_URL } from "@/urlConfig";

export default {
  name: "Banner",
  data() {
    return {
      tableData: [],
      hideAfter: 2000, // ms
      align: "center",
    };
  },
  created() {
    this.getBanner();
  },
  methods: {
    async getBanner() {
      try {
        const { data } = await fetchBanner();
        console.log(data); // {bigImg, description, id, midImg, title}
        this.tableData = data;
        this.tableData.forEach((item) => {
          item.midImg2 = server_URL + item.midImg; // /static/upload/xxx.jpg
          item.bigImg2 = server_URL + item.bigImg;
        });
      } catch (error) {
        this.$message.error(`获取数据失败: ${error.message}`);
      }
    },
  },
};
</script>

<style lang="sass" scoped></style>
