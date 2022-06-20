<template>
  <article-preview
    v-for="article in $props.articles"
    :key="article.slug"
    :author="article.author"
    :createdAt="article.createdAt"
    :favoritesCount="article.favoritesCount"
    :title="article.title"
    :description="article.description"
  />
</template>

<script>
import ArticlePreview from "./ArticlePreview.vue";

export default {
  name: "ArticleFeed",
  components: { ArticlePreview },
  props: {
    articles: Array
  },
  setup() {}
};
</script>
