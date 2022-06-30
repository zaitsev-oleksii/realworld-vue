<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <u-tabs :tabsMeta="tabsMeta" :isAuthorized="isAuthorized" />
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <tag-list
              :tags="popularTags"
              :theme="TAG_LIST_THEMES.dark"
              @tag-selected="(tag) => filterByTag(tag)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, inject, markRaw } from "vue";
import { useStore } from "vuex";

import ArticleFeed from "../components/ArticleFeed.vue";
import TagList from "../components/TagList.vue";

import { TAG_LIST_THEMES } from "../config";
import UTabs from "../components/UTabs.vue";

export default {
  name: "HomePage",
  components: { TagList, UTabs },
  setup() {
    const store = useStore();
    const articlesAPI = inject("articlesAPI");

    const popularTags = ref([]);
    onMounted(async () => {
      const tags = (await articlesAPI.getTags()).data;
      popularTags.value = tags;
    });

    const tabsMeta = ref([
      {
        name: "Personal",
        display: "Personal Feed",
        component: markRaw(ArticleFeed),
        requiresAuth: true,
        props: { api: articlesAPI.getArticlesFeed }
      },
      {
        name: "Global",
        display: "Global Feed",
        component: markRaw(ArticleFeed),
        props: { api: articlesAPI.getArticles, filterParams: {} }
      }
    ]);

    const filterByTag = (tag) => {
      const filteredFeedTabMeta = {
        name: `FilteredFeed`,
        display: `#${tag}`,
        component: ArticleFeed,
        props: { api: articlesAPI.getArticles, filterParams: { tag: tag } },
        autoSelected: true
      };
      tabsMeta.value = tabsMeta.value.filter(
        (tab) => tab.name !== "FilteredFeed"
      );
      tabsMeta.value.push(filteredFeedTabMeta);
    };

    return {
      popularTags,
      isAuthorized: computed(() => store.getters.isAuthorized),
      tabsMeta,
      filterByTag,
      TAG_LIST_THEMES
    };
  }
};
</script>
