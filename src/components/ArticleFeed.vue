<template>
  <template v-if="articles.length > 0">
    <article-list :articles="articles" />
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
// import { useStore } from "vuex";

import ArticleList from "./ArticleList.vue";
import usePagination from "../composables/pagination";

import { ARTICLES_PER_PAGE } from "../config";

export default {
  name: "ArticleFeed",
  components: { ArticleList },
  props: {
    api: Function,
    filterParams: Object
  },
  setup(props) {
    // const store = useStore();

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
      const articlesData = (
        await props.api({
          limit: ARTICLES_PER_PAGE,
          offset: offset.value,
          filterParams: props.filterParams
        })
      ).data;

      articles.value = articlesData;
    };
    const setPrefetchedArticlesData = async () => {
      const prefetchedArticlesData = (
        await props.api({
          limit: ARTICLES_PER_PAGE,
          offset: offset.value + ARTICLES_PER_PAGE,
          filterParams: props.filterParams
        })
      ).data;
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
