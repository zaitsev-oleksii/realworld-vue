<template>
  <div class="article-preview" v-if="isLoading">{{ loadingMessage }}</div>
  <template v-else>
    <template v-if="articles.length > 0">
      <article-list :articles="articles" />
      <template v-if="totalPages > 1">
        <button
          class="btn btn-default"
          v-if="!isFirstPage"
          @click="goToPrevPage"
        >
          <i class="ion-android-arrow-back"></i> Previous
        </button>
        <button
          class="btn btn-default"
          :class="{
            'btn-primary': btn.page === currentPage
          }"
          v-for="btn in paginationButtons"
          :key="btn.page"
          @click="btn.handler"
        >
          {{ btn.page }}
        </button>
        <button
          class="btn btn-default"
          v-if="!isLastPage"
          @click="goToNextPage"
        >
          Next <i class="ion-android-arrow-forward"></i>
        </button>
      </template>
    </template>
    <div class="article-preview" v-else>No articles here... yet</div>
  </template>
</template>

<script>
import { ref, computed, watch } from "vue";

import ArticleList from "./ArticleList.vue";

import usePagination from "../composables/pagination";
import useLoading from "../composables/loading";

import { ARTICLES_PER_PAGE } from "../config";

export default {
  name: "ArticleFeed",
  components: { ArticleList },
  props: {
    api: Function,
    countApi: Function,
    filterParams: Object
  },
  setup(props) {
    const articles = ref([]);
    const articlesTotalCount = ref(undefined);

    const [
      { isLoading, message: loadingMessage },
      { start: startLoading, stop: stopLoading }
    ] = useLoading(true);

    /*
      Roundabout since we cannot get total articles count
      from API directly without loading all the articles data
      Prefetching next page articles and hiding prev/next page
      buttons so that user can't navigate to empty page
    */
    // const prefetchedArticles = ref([]);
    const buttonsVisible = ref(false);

    const {
      currentPage,
      offset,
      goToPrevPage,
      goToNextPage,
      goToPage,
      firstPage,
      lastPage,
      totalPages
    } = usePagination({
      limitPerPage: ARTICLES_PER_PAGE,
      totalElements: articlesTotalCount
    });

    const paginationButtons = computed(() => {
      const range = (start, end) => {
        return [...Array(end - start + 1).keys()].map((i) => i + start);
      };
      const windowSize = 5;
      const windowStart =
        currentPage.value === firstPage.value || totalPages.value < windowSize
          ? firstPage.value
          : currentPage.value - 1;
      const windowEnd =
        currentPage.value > lastPage.value - 3 || totalPages.value < windowSize
          ? lastPage.value
          : currentPage.value + 3;
      const paginationWindow = range(windowStart, windowEnd);
      return paginationWindow.map((page) => ({
        page,
        handler: () => goToPage(page)
      }));
    });

    const isFirstPage = computed(() => currentPage.value === firstPage.value);
    const isLastPage = computed(
      () => currentPage.value === lastPage.value
      // || prefetchedArticles.value.length === 0
    );

    const loadArticles = async () => {
      const { error, data: articlesData } = await props.api({
        limit: ARTICLES_PER_PAGE,
        offset: offset.value,
        filterParams: props.filterParams
      });
      if (error) {
        return;
      }
      articles.value = articlesData;
    };

    const loadArticlesTotalCount = async () => {
      const { error, data: totalCount } = await props.countApi({
        filterParams: props.filterParams
      });
      if (error) {
        return;
      }
      articlesTotalCount.value = totalCount;
    };
    // const loadPrefetchedArticles = async () => {
    //   const { error, data: prefetchedArticlesData } = await props.api({
    //     limit: ARTICLES_PER_PAGE,
    //     offset: offset.value + ARTICLES_PER_PAGE,
    //     filterParams: props.filterParams
    //   });
    //   if (error) {
    //     return;
    //   }
    //   prefetchedArticles.value = prefetchedArticlesData;
    // };

    watch(
      [currentPage, () => props.filterParams],
      async () => {
        startLoading("Loading articles...");
        buttonsVisible.value = false;
        await loadArticles();
        await loadArticlesTotalCount();
        // console.log(articlesTotalCount.value);
        // await loadPrefetchedArticles();
        buttonsVisible.value = true;
        stopLoading();
      },
      { immediate: true }
    );

    return {
      articles,
      isLoading,
      loadingMessage,
      goToPrevPage,
      goToNextPage,
      currentPage,
      totalPages,
      isFirstPage,
      isLastPage,
      paginationButtons,
      buttonsVisible
    };
  }
};
</script>
