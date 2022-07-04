import { axiosClient } from "./axios-client";

const PROFILE_PATH = "/profiles/:username";
const FOLLOW_PROFILE_PATH = "/profiles/:username/follow";

export const getProfile = (username) => {
  const url = PROFILE_PATH.replace(":username", encodeURIComponent(username));
  return axiosClient
    .get(url)
    .then((res) => ({ error: null, data: res.data.profile }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const follow = (username) => {
  const url = FOLLOW_PROFILE_PATH.replace(
    ":username",
    encodeURIComponent(username)
  );
  return axiosClient
    .post(url)
    .then((res) => ({ error: null, data: res.data.profile }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const unfollow = (username) => {
  const url = FOLLOW_PROFILE_PATH.replace(
    ":username",
    encodeURIComponent(username)
  );
  return axiosClient
    .delete(url)
    .then((res) => ({ error: null, data: res.data.profile }))
    .catch((err) => ({ error: err.response.data.errors }));
};

const profileAPI = {
  getProfile,
  follow,
  unfollow
};

export default profileAPI;
