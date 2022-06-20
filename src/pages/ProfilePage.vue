<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <follow-button :username="username" />
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{
                    active: currentArticlesTab === articlesTabs.Created
                  }"
                  @click="setArticlesTab(articlesTabs.Created)"
                  >My Articles</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{
                    active: currentArticlesTab === articlesTabs.Favorited
                  }"
                  @click="setArticlesTab(articlesTabs.Favorited)"
                  >Favorited Articles</a
                >
              </li>
            </ul>
          </div>

          <article-feed
            v-if="currentArticlesTab === articlesTabs.Created"
            :articles="profileArticles"
          />
          <article-feed
            v-if="currentArticlesTab === articlesTabs.Favorited"
            :articles="favoritedArticles"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
// import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import profileAPI from "../api/profile";
import articlesAPI from "../api/articles";

import FollowButton from "../components/FollowButton.vue";
import ArticleFeed from "../components/ArticleFeed.vue";

const articlesTabs = {
  Created: "Created",
  Favorited: "Favorited"
};

export default {
  name: "ProfilePage",
  components: { FollowButton, ArticleFeed },
  setup() {
    // const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const profile = ref({
      username: "",
      bio: "",
      image: "",
      following: false
    });
    const profileArticles = ref([]);
    const favoritedArticles = ref([]);

    const currentArticlesTab = ref(articlesTabs.Created);
    const setArticlesTab = (newTab) => {
      currentArticlesTab.value = newTab;
    };

    const setProfileData = async () => {
      const profileData = await profileAPI.getProfile(route.params.username);
      if (!profileData) {
        router.push("/");
        return;
      }

      const profileArticlesData = await articlesAPI.getArticles(10, 0, {
        author: route.params.username
      });
      const favoritedArticlesData = await articlesAPI.getArticles(10, 0, {
        favoritedBy: route.params.username
      });

      profile.value = profileData;
      profileArticles.value = profileArticlesData;
      favoritedArticles.value = favoritedArticlesData;
    };

    onMounted(setProfileData);
    watch(() => route.params.username, setProfileData);

    return {
      username: computed(() => route.params.username),
      profile,
      profileArticles,
      favoritedArticles,
      articlesTabs,
      currentArticlesTab,
      setArticlesTab
    };
  }
};
</script>
