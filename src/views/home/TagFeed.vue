<template>
  <article-feed :api="api" :filterParams="filterParams" />
</template>

<script>
import { computed, inject } from "vue";
import ArticleFeed from "../../components/ArticleFeed.vue";

export default {
  name: "GlobalFeed",
  components: { ArticleFeed },
  props: {
    tag: String
  },
  setup(props) {
    const articlesAPI = inject("articlesAPI");

    const filterParams = computed(() => ({
      tag: props.tag
    }));

    return {
      api: articlesAPI.getArticles,
      filterParams
    };
  }
};
</script>
