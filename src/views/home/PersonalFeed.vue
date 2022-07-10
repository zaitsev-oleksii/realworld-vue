<template>
  <article-feed :api="api" />
</template>

<script>
import { inject } from "vue";
import ArticleFeed from "../../components/ArticleFeed.vue";

export default {
  name: "GlobalFeed",
  components: { ArticleFeed },
  setup() {
    const articlesAPI = inject("articlesAPI");
    return { api: articlesAPI.getArticlesFeed };
  }
};
</script>
