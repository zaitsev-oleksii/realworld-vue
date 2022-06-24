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
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li
                class="nav-item"
                v-for="tab in accessibleTabs"
                :key="tab.name"
              >
                <a
                  class="nav-link"
                  :class="{
                    active: currentTab.name === tab.name
                  }"
                  @click="setCurrentTab(tab.name)"
                  >{{ tab.display }}</a
                >
              </li>
            </ul>
          </div>
          <component
            :is="currentTabComponent"
            v-bind="currentTab.props"
            :key="currentTab"
          />
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <a
                class="tag-pill tag-default"
                v-for="tag in tagList"
                :key="tag"
                @click="filterByTag(tag)"
                >{{ tag }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import articlesAPI from "../api/articles";

import useTabs from "../composables/tabs";

import ArticleFeed from "../components/ArticleFeed.vue";

export default {
  name: "HomePage",
  setup() {
    const tagList = ref([]);
    onMounted(async () => {
      const tags = await articlesAPI.getTags();
      tagList.value = tags;
    });

    const tabsMeta = [
      {
        name: "Personal",
        display: "Personal Feed",
        component: ArticleFeed,
        requiresAuth: true,
        props: { api: articlesAPI.getArticlesFeed }
      },
      {
        name: "Global",
        display: "Global Feed",
        component: ArticleFeed,
        props: { api: articlesAPI.getArticles, filterParams: {} }
      }
    ];

    const {
      accessibleTabs,
      currentTab,
      currentTabComponent,
      setCurrentTab,
      addTab,
      removeTab
    } = useTabs(tabsMeta);

    const filterByTag = (tag) => {
      const filteredFeedTabMeta = {
        name: `FilteredFeed`,
        display: `#${tag}`,
        component: ArticleFeed,
        props: { api: articlesAPI.getArticles, filterParams: { tag: tag } }
      };
      removeTab("FilteredFeed");
      addTab(filteredFeedTabMeta);
      setCurrentTab("FilteredFeed");
    };

    return {
      tagList,
      accessibleTabs,
      currentTab,
      setCurrentTab,
      currentTabComponent,
      tabsMeta,
      filterByTag
    };
  }
};
</script>
