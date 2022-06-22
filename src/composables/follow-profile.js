import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import profileAPI from "../api/profile";
import articleAPI from "../api/articles";

const useFollowProfile = ({ username, articleSlug }) => {
  const store = useStore();
  const router = useRouter();
  const isAuthorized = computed(() => store.getters.isAuthorized);

  const following = ref(null);

  let profile = null;

  const execute = async () => {
    if (articleSlug) {
      const articleData = await articleAPI.getArticle(
        articleSlug,
        store.state.user.token
      );
      following.value = articleData.author.following;
      profile = articleData.author.username;
    }
    if (username) {
      const profileData = await profileAPI.getProfile(username);
      following.value = profileData.following;
      profile = username;
    }
  };

  const handleFollow = async () => {
    if (following.value === null || !profile) return;

    if (!isAuthorized.value) {
      router.push({ path: "/login" });
      return;
    }

    const profileData = await (!following.value
      ? profileAPI.follow(store.state.user.token, profile)
      : profileAPI.unfollow(store.state.user.token, profile));

    following.value = profileData.following;
  };

  execute();

  return [following, handleFollow];
};

export default useFollowProfile;
