<template>
  <div class="article-add-container">
    <article-detail mode="add" />
  </div>
</template>

<script>
import ArticleDetail from './detail.vue'

export default {
  name: 'ArticleAdd',
  components: {
    ArticleDetail
  }
}
</script>

<style scoped></style>
