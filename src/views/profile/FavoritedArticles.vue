<template>
  <article-feed :api="api" :countApi="countApi" :filterParams="filterParams" />
</template>

<script>
import { computed, inject } from "vue";
import ArticleFeed from "../../components/ArticleFeed.vue";

export default {
  name: "FavoritedArticles",
  components: { ArticleFeed },
  props: {
    username: String
  },
  setup(props) {
    const articlesAPI = inject("articlesAPI");

    const filterParams = computed(() => ({
      favoritedBy: props.username
    }));

    return {
      api: articlesAPI.getArticles,
      countApi: articlesAPI.getArticlesTotalCount,
      filterParams
    };
  }
};
</script>
