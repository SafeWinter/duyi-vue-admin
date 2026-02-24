<template>
  <div class="about-container" v-loading="loading || !contentReady">
    <iframe
      class="content"
      :src="src"
      frameborder="0"
      @load="contentReady = true"
    ></iframe>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "About",
  computed: {
    ...mapState("about", {
      src: "data",
      loading: "loading",
    }),
  },
  data() {
    return {
      contentReady: false,
    };
  },
  async created() {
    await this.$store.dispatch("about/fetchAbout");
  },
};
</script>

<style scoped lang="less">
.about-container,
.content {
  width: 100%;
  height: 100%;
}
.about-container {
  position: relative;
  overflow: hidden;
}
.content {
  display: block;
  box-sizing: border-box;
}
</style>
