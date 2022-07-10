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
              @toggle-follow="handleFollow"
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
              <li class="nav-item">
                <router-link
                  :to="{ name: 'profile' }"
                  class="nav-link"
                  exact-active-class="active"
                >
                  My Articles
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'favorited-articles' }"
                  class="nav-link"
                  exact-active-class="active"
                >
                  Favorited Articles
                </router-link>
              </li>
            </ul>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import FollowButton from "../components/FollowButton.vue";

import LoadingSpinner from "../components/LoadingSpinner.vue";

import useFollowProfile from "../composables/follow-profile";
import useLoading from "../composables/loading";

export default {
  name: "ProfileView",
  components: { FollowButton, LoadingSpinner },
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

    const isAuthorized = computed(() => store.getters.isAuthorized);

    const profile = ref(null);
    const isCurrentUserProfile = computed(
      () => store.state.user.username === props.username
    );

    const [{ isLoading }, { start: startLoading, stop: stopLoading }] =
      useLoading(true);

    const setProfileData = async () => {
      const profileData = (await profileAPI.getProfile(props.username)).data;
      if (!profileData) {
        router.push({ name: "home" });
        return;
      }

      profile.value = profileData;
    };

    watch(
      () => props.username,
      async () => {
        startLoading();
        await setProfileData();
        stopLoading();
      },
      { immediate: true }
    );

    const [following, handleFollow] = useFollowProfile(
      {
        username: props.username
      },
      isAuthorized,
      () => {
        router.push({ name: "login" });
      }
    );

    return {
      profile,
      isCurrentUserProfile,
      isLoading,
      following,
      isAuthorized: computed(() => store.getters.isAuthorized),
      handleFollow
    };
  }
};
</script>
