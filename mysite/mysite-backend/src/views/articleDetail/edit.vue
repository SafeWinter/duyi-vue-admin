<template>
  <div class="article-edit-container">
    <article-detail mode="edit" />
  </div>
</template>

<script>
import ArticleDetail from './detail.vue'

export default {
  name: 'ArticleEdit',
  components: {
    ArticleDetail
  }
}
</script>

<style scoped></style>
