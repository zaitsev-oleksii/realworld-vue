import { computed, unref, inject } from "vue";

const useFollowProfile = ({
  username,
  initFollowing = null,
  isAuthenticated = false,
  onUnauthenticated = () => {}
}) => {
  const profileAPI = inject("profileAPI");

  const following = computed(() => initFollowing);

  // const checkFollowingStatus = async () => {
  //   const { error, data: profileData } = await profileAPI.getProfile(username);
  //   if (error) {
  //     return;
  //   }
  //   following.value = profileData.following;
  // };

  const handleFollow = async () => {
    if (following.value === null) {
      return;
    }

    if (!unref(isAuthenticated)) {
      onUnauthenticated();
      return;
    }

    const { error, data: profileData } = await (!following.value
      ? profileAPI.follow(username.value)
      : profileAPI.unfollow(username.value));

    if (error) {
      return;
    }

    following.value = profileData.following;
  };

  // if (initFollowing === null) checkFollowingStatus();

  return [following, handleFollow];
};

export default useFollowProfile;
