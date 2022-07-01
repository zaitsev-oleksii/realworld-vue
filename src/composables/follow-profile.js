import { ref, computed, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const useFollowProfile = (username) => {
  const store = useStore();
  const router = useRouter();
  const profileAPI = inject("profileAPI");

  const isAuthorized = computed(() => store.getters.isAuthorized);

  const following = ref(null);

  const checkFollowingStatus = async () => {
    const profileData = (await profileAPI.getProfile(username)).data;
    following.value = profileData.following;
  };

  const handleFollow = async () => {
    if (following.value === null || !username) return;

    if (!isAuthorized.value) {
      router.push({ path: "/login" });
      return;
    }

    const profileData = (
      await (!following.value
        ? profileAPI.follow(username)
        : profileAPI.unfollow(username))
    ).data;

    following.value = profileData.following;
  };

  checkFollowingStatus();

  return [following, handleFollow];
};

export default useFollowProfile;
