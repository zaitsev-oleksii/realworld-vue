import { ref, unref, inject } from "vue";

const useFollowProfile = ({
  username,
  initFollowing = null,
  isAuthorized = false,
  onUnauthorized = () => {}
}) => {
  const profileAPI = inject("profileAPI");

  const following = ref(initFollowing);

  const checkFollowingStatus = async () => {
    const { error, data: profileData } = await profileAPI.getProfile(username);
    if (error) {
      return;
    }
    following.value = profileData.following;
  };

  const handleFollow = async () => {
    if (following.value === null) {
      return;
    }

    if (!unref(isAuthorized)) {
      onUnauthorized();
      return;
    }

    const profileData = (
      await (!following.value
        ? profileAPI.follow(username)
        : profileAPI.unfollow(username))
    ).data;

    following.value = profileData.following;
  };

  if (initFollowing === null) checkFollowingStatus();

  return [following, handleFollow];
};

export default useFollowProfile;
