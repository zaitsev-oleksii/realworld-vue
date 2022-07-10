<template>
  <article-preview
    v-for="article in articles"
    :key="article.slug"
    :slug="article.slug"
    :author="article.author"
    :createdAt="article.createdAt"
    :title="article.title"
    :description="article.description"
    :tags="article.tagList"
  />
</template>

<script>
import ArticlePreview from "./ArticlePreview.vue";

export default {
  name: "ArticleList",
  components: { ArticlePreview },
  props: {
    articles: Array
  },
  setup() {}
};
</script>
