<template>
  <button @click="handleClick" class="btn btn-sm btn-outline-secondary">
    <i class="ion-plus-round"></i>
    &nbsp; {{ !following ? "Follow" : "Unfollow" }} {{ $props.username }}
  </button>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import profileAPI from "../api/profile";

export default {
  name: "FollowButton",
  props: {
    username: String
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const following = ref(null);
    onMounted(async () => {
      const profileData = await profileAPI.getProfile(props.username);

      following.value = profileData.following;
    });

    const isAuthorized = computed(() => store.getters.isAuthorized);

    const handleClick = async () => {
      if (!isAuthorized.value) {
        router.push({ path: "/login" });
        return;
      }
      console.log(props.following);

      const profileData = await (!following.value
        ? profileAPI.follow(store.state.user.token, props.username)
        : profileAPI.unfollow(store.state.user.token, props.username));

      following.value = profileData.following;
    };

    return {
      isAuthorized,
      following,
      handleClick
    };
  }
};
</script>
