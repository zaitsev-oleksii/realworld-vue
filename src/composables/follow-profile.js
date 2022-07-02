import { ref, unref, inject } from "vue";

const useFollowProfile = (
  { username, articleSlug },
  isAuthorized = false,
  onUnauthorized = () => {}
) => {
  const profileAPI = inject("profileAPI");
  const articlesAPI = inject("articlesAPI");

  const following = ref(null);

  let user = null;
  const checkFollowingStatus = async () => {
    if (articleSlug) {
      const profileData = (await articlesAPI.getArticle(articleSlug)).data
        .author;
      following.value = profileData.following;
      user = profileData;
    } else {
      const profileData = (await profileAPI.getProfile(username)).data;
      following.value = profileData.following;
      user = profileData;
    }
  };

  const handleFollow = async () => {
    if (following.value === null || (!username && !articleSlug)) return;

    if (!unref(isAuthorized)) {
      onUnauthorized();
      return;
    }

    const profileData = (
      await (!following.value
        ? profileAPI.follow(user.username)
        : profileAPI.unfollow(user.username))
    ).data;

    following.value = profileData.following;
  };

  checkFollowingStatus();

  return [following, handleFollow];
};

export default useFollowProfile;
