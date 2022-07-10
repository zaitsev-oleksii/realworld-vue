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
              <li class="nav-item" v-if="isAuthorized">
                <router-link
                  :to="{ name: 'personal-feed' }"
                  class="nav-link"
                  exact-active-class="active"
                >
                  Your Feed
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'home' }"
                  class="nav-link"
                  exact-active-class="active"
                >
                  Global Feed
                </router-link>
              </li>
              <li class="nav-item" v-if="$route.name === 'tag-feed'">
                <router-link
                  :to="{ name: 'tag-feed', params: $route.params }"
                  class="nav-link"
                  exact-active-class="active"
                >
                  <i class="ion-pound"></i>&nbsp;{{ $route.params.tag }}
                </router-link>
              </li>
            </ul>
          </div>
          <router-view></router-view>
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
import { ref, onMounted, computed, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import TagList from "../components/TagList.vue";

import { TAG_LIST_THEMES } from "../config";

export default {
  name: "HomeView",
  components: { TagList },
  setup() {
    const store = useStore();
    const router = useRouter();
    const articlesAPI = inject("articlesAPI");

    const popularTags = ref([]);
    onMounted(async () => {
      const tags = (await articlesAPI.getTags()).data;
      popularTags.value = tags;
    });

    const filterByTag = (tag) => {
      router.push({ name: "tag-feed", params: { tag: tag } });
    };

    return {
      popularTags,
      isAuthorized: computed(() => store.getters.isAuthorized),
      filterByTag,
      TAG_LIST_THEMES
    };
  }
};
</script>
