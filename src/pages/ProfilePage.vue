<template>
  <div class="profile-page" v-if="profile">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <router-link to="/settings" v-if="isCurrentUserProfile">
              <button class="btn btn-sm btn-outline-secondary">
                <i class="ion-gear-a"></i>
                &nbsp; Edit Profile Settings
              </button>
            </router-link>
            <follow-button
              v-else
              :following="following"
              @click="handleFollow"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
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
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import profileAPI from "../api/profile";
import articlesAPI from "../api/articles";

import FollowButton from "../components/FollowButton.vue";
import ArticleFeed from "../components/ArticleFeed.vue";

import useFollowProfile from "../composables/follow-profile";
import useTabs from "../composables/tabs";

export default {
  name: "ProfilePage",
  components: { FollowButton, ArticleFeed },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const profile = ref(null);

    const isCurrentUserProfile = computed(
      () => store.state.user.username === route.params.username
    );

    const setProfileData = async () => {
      const profileData = await profileAPI.getProfile({
        username: route.params.username
      });
      if (!profileData) {
        router.push("/");
        return;
      }

      profile.value = profileData;
    };

    const tabsMeta = [
      {
        name: "UsersArticles",
        display: "My Articles",
        component: ArticleFeed,
        props: {
          api: articlesAPI.getArticles,
          filterParams: { author: route.params.username }
        }
      },
      {
        name: "FavoritedArticles",
        display: "Favorited Articles",
        component: ArticleFeed,
        props: {
          api: articlesAPI.getArticles,
          filterParams: { favoritedBy: route.params.username }
        }
      }
    ];

    const { accessibleTabs, currentTab, currentTabComponent, setCurrentTab } =
      useTabs(tabsMeta, store.getters.isAuthorized);

    onMounted(setProfileData);
    watch(() => route.params.username, setProfileData);

    const [following, handleFollow] = useFollowProfile({
      username: route.params.username
    });

    return {
      profile,
      isCurrentUserProfile,
      accessibleTabs,
      currentTab,
      currentTabComponent,
      setCurrentTab,
      following,
      handleFollow
    };
  }
};
</script>
