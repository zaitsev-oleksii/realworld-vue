<template>
  <template v-if="articles.length > 0">
    <article-feed :articles="articles" />
    <button
      class="btn btn-default"
      v-if="!isFirstPage && buttonsVisible"
      @click="goToPrevPage"
    >
      <i class="ion-android-arrow-back"></i> Previous
    </button>
    <button
      class="btn btn-default"
      v-if="!isLastPage && buttonsVisible"
      @click="goToNextPage"
    >
      Next <i class="ion-android-arrow-forward"></i>
    </button>
  </template>
  <div v-else>No articles here... yet</div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import articlesAPI from "../api/articles";

import ArticleFeed from "../components/ArticleFeed.vue";

import usePagination from "../composables/pagination";

import { ARTICLES_PER_PAGE } from "../config";

export default {
  name: "GlobalFeed",
  components: { ArticleFeed },
  setup() {
    const articles = ref([]);

    /* 
      Roundabout since we cannot get total articles count
      from API directly without loading all the articles data
      Prefetching next page articles and hiding prev/next page
      buttons so that user can't navigate to empty page
    */
    const prefetchedArticles = ref([]);
    const buttonsVisible = ref(false);

    const {
      currentPage,
      offset,
      goToPrevPage,
      goToNextPage,
      firstPage,
      lastPage
    } = usePagination({
      limitPerPage: ARTICLES_PER_PAGE
    });

    const isFirstPage = computed(() => currentPage.value === firstPage);
    const isLastPage = computed(
      () =>
        currentPage.value === lastPage || prefetchedArticles.value.length === 0
    );

    const setArticlesData = async () => {
      const articlesData = await articlesAPI.getArticles(
        ARTICLES_PER_PAGE,
        offset.value
      );

      articles.value = articlesData;
    };
    const setPrefetchedArticlesData = async () => {
      const prefetchedArticlesData = await articlesAPI.getArticles(
        ARTICLES_PER_PAGE,
        offset.value + ARTICLES_PER_PAGE
      );
      prefetchedArticles.value = prefetchedArticlesData;
    };

    onMounted(() => {
      setArticlesData();
      setPrefetchedArticlesData();
      buttonsVisible.value = true;
    });

    watch(currentPage, async () => {
      buttonsVisible.value = false;
      await setArticlesData();
      await setPrefetchedArticlesData();
      buttonsVisible.value = true;
    });

    return {
      articles,
      goToPrevPage,
      goToNextPage,
      currentPage,
      isFirstPage,
      isLastPage,
      buttonsVisible
    };
  }
};
</script>
