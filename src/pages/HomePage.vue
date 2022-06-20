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
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{
                    active: currentFeed === feedTabs.Personal,
                    disabled: !isAuthorized
                  }"
                  @click="setCurrentFeed(feedTabs.Personal)"
                  >Your Feed</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{
                    active: currentFeed === feedTabs.Global
                  }"
                  @click="setCurrentFeed(feedTabs.Global)"
                  >Global Feed</a
                >
              </li>
            </ul>
          </div>

          <personal-feed
            v-if="isAuthorized && currentFeed === feedTabs.Personal"
          />
          <global-feed v-if="currentFeed === feedTabs.Global" />
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <a
                href=""
                class="tag-pill tag-default"
                v-for="(tag, idx) in tagList"
                :key="idx"
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
import { useStore } from "vuex";
import articlesAPI from "../api/articles";

import GlobalFeed from "../layout/GlobalFeed.vue";
import PersonalFeed from "../layout/PersonalFeed.vue";

const feedTabs = {
  Global: "Global",
  Personal: "Personal"
};

export default {
  name: "HomePage",
  components: { GlobalFeed, PersonalFeed },
  setup() {
    const store = useStore();

    const tagList = ref([]);
    onMounted(async () => {
      const tags = await articlesAPI.getTags();
      tagList.value = tags;
    });

    const currentFeed = ref(
      store.getters.isAuthorized ? feedTabs.Personal : feedTabs.Global
    );
    const setCurrentFeed = (newFeed) => {
      if (newFeed === feedTabs.Personal && !store.getters.isAuthorized) return;
      currentFeed.value = newFeed;
    };

    return {
      tagList,
      feedTabs,
      currentFeed,
      setCurrentFeed,
      isAuthorized: store.getters.isAuthorized
    };
  }
};
</script>
