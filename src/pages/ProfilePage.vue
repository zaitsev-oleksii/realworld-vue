<template>
  <loading-spinner v-if="isLoading" />
  <div class="profile-page" v-else>
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile?.image" class="user-img" />
            <h4>{{ profile?.username }}</h4>
            <p>
              {{ profile?.bio }}
            </p>
            <router-link :to="{ name: 'settings' }" v-if="isCurrentUserProfile">
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
          <u-tabs :tabsMeta="tabsMeta" :isAuthorized="isAuthorized" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, inject, markRaw } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import FollowButton from "../components/FollowButton.vue";
import UTabs from "../components/UTabs.vue";
import ArticleFeed from "../components/ArticleFeed.vue";

import LoadingSpinner from "../components/LoadingSpinner.vue";

import useFollowProfile from "../composables/follow-profile";
import useLoading from "../composables/loading";

export default {
  name: "ProfilePage",
  components: { FollowButton, LoadingSpinner, UTabs },
  props: {
    username: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const profileAPI = inject("profileAPI");
    const articlesAPI = inject("articlesAPI");

    const profile = ref(null);
    const isCurrentUserProfile = computed(
      () => store.state.user.username === props.username
    );

    const [{ isLoading }, { start: startLoading, stop: stopLoading }] =
      useLoading(true);

    const setProfileData = async () => {
      startLoading();
      const profileData = (await profileAPI.getProfile(props.username)).data;
      if (!profileData) {
        router.push("/");
        return;
      }

      profile.value = profileData;
      stopLoading();
    };

    const tabsMeta = ref([
      {
        name: "UsersArticles",
        display: "My Articles",
        component: markRaw(ArticleFeed),
        props: {
          api: articlesAPI.getArticles,
          filterParams: { author: props.username }
        }
      },
      {
        name: "FavoritedArticles",
        display: "Favorited Articles",
        component: markRaw(ArticleFeed),
        props: {
          api: articlesAPI.getArticles,
          filterParams: { favoritedBy: props.username }
        }
      }
    ]);

    onMounted(setProfileData);
    watch(() => props.username, setProfileData);

    const [following, handleFollow] = useFollowProfile({
      username: props.username
    });

    return {
      profile,
      isCurrentUserProfile,
      isLoading,
      following,
      tabsMeta,
      isAuthorized: computed(() => store.getters.isAuthorized),
      handleFollow
    };
  }
};
</script>
