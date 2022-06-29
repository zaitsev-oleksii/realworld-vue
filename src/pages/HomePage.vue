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
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

import ArticleFeed from "../components/ArticleFeed.vue";
import TagList from "../components/TagList.vue";

import articlesAPI from "../api/articles";

import useTabs from "../composables/tabs";

import { TAG_LIST_THEMES } from "../config";

export default {
  name: "HomePage",
  components: { TagList },
  setup() {
    const store = useStore();

    const popularTags = ref([]);
    onMounted(async () => {
      const tags = (await articlesAPI.getTags()).data;
      popularTags.value = tags;
    });

    const tabsMeta = [
      {
        name: "Personal",
        display: "Personal Feed",
        component: ArticleFeed,
        requiresAuth: true,
        props: { api: articlesAPI.getArticlesFeed },
        onSelect: () => removeTab("FilteredFeed")
      },
      {
        name: "Global",
        display: "Global Feed",
        component: ArticleFeed,
        props: { api: articlesAPI.getArticles, filterParams: {} },
        onSelect: () => removeTab("FilteredFeed")
      }
    ];

    const {
      accessibleTabs,
      currentTab,
      currentTabComponent,
      setCurrentTab,
      addTab,
      removeTab
    } = useTabs(tabsMeta, store.getters.isAuthorized);

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
      popularTags,
      accessibleTabs,
      currentTab,
      setCurrentTab,
      currentTabComponent,
      tabsMeta,
      filterByTag,
      TAG_LIST_THEMES
    };
  }
};
</script>
