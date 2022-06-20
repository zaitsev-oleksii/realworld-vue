<template>
  <article-feed v-if="articles.length > 0" :articles="articles" />
  <div v-else>No articles here... yet</div>
</template>

<script>
import { ref, onMounted } from "vue";
import articlesAPI from "../api/articles";

import ArticleFeed from "../components/ArticleFeed.vue";

export default {
  name: "GlobalFeed",
  components: { ArticleFeed },
  setup() {
    const articles = ref([]);

    onMounted(async () => {
      const articlesData = await articlesAPI.getArticles();
      articles.value = articlesData;
    });

    return {
      articles
    };
  }
};
</script>
