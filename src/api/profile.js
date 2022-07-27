import { axiosClient } from "./axios-client";
import { errorCatcher } from "./error-catcher";

const PROFILE_PATH = "/profiles/:username";
const FOLLOW_PROFILE_PATH = "/profiles/:username/follow";

export const getProfile = (username) => {
  const url = PROFILE_PATH.replace(":username", encodeURIComponent(username));
  return errorCatcher(
    axiosClient.get(url).then((res) => ({ data: res.data.profile }))
  );
};

export const follow = (username) => {
  const url = FOLLOW_PROFILE_PATH.replace(
    ":username",
    encodeURIComponent(username)
  );
  return errorCatcher(
    axiosClient.post(url).then((res) => ({ data: res.data.profile }))
  );
};

export const unfollow = (username) => {
  const url = FOLLOW_PROFILE_PATH.replace(
    ":username",
    encodeURIComponent(username)
  );
  return errorCatcher(
    axiosClient.delete(url).then((res) => ({ data: res.data.profile }))
  );
};

const profileAPI = {
  getProfile,
  follow,
  unfollow
};

export default profileAPI;
