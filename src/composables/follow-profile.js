import { ref, computed, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const useFollowProfile = ({ username, articleSlug }) => {
  const store = useStore();
  const router = useRouter();
  const profileAPI = inject("profileAPI");
  const articlesAPI = inject("articlesAPI");

  const isAuthorized = computed(() => store.getters.isAuthorized);

  const following = ref(null);

  let profile = null;

  const execute = async () => {
    if (articleSlug) {
      const articleData = (await articlesAPI.getArticle(articleSlug)).data;
      following.value = articleData.author.following;
      profile = articleData.author.username;
    }
    if (username) {
      const profileData = (await profileAPI.getProfile(username)).data;
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

    const profileData = (
      await (!following.value
        ? profileAPI.follow(profile)
        : profileAPI.unfollow(profile))
    ).data;

    following.value = profileData.following;
  };

  execute();

  return [following, handleFollow];
};

export default useFollowProfile;
