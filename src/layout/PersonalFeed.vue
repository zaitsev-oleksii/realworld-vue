<template>
  <template v-if="isAuthorized">
    <article-feed v-if="articles.length > 0" :articles="articles" />
    <div v-else>No articles here... yet</div>
  </template>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import articlesAPI from "../api/articles";

import ArticleFeed from "../components/ArticleFeed.vue";

export default {
  name: "PersonalFeed",
  components: { ArticleFeed },
  setup() {
    const store = useStore();
    const articles = ref([]);

    onMounted(async () => {
      const articlesData = await articlesAPI.getArticlesFeed(
        store.state.user.token
      );
      articles.value = articlesData;
    });

    return {
      articles,
      isAuthorized: store.getters.isAuthorized
    };
  }
};
</script>
