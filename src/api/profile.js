import axios from "axios";
import tokenService from "../token-service";

const BASE_API_URL = "https://api.realworld.io/api";
const PROFILE_PATH = "/profiles/:username";
const FOLLOW_PROFILE_PATH = "/profiles/:username/follow";

const authToken = tokenService.getToken();

const instance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    ...(authToken && { Authorization: `Bearer ${authToken} ` })
  }
});

export const getProfile = (username) => {
  const url = PROFILE_PATH.replace(":username", encodeURIComponent(username));
  return instance
    .get(url)
    .then((res) => ({ error: null, data: res.data.profile }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const follow = (username) => {
  const url = FOLLOW_PROFILE_PATH.replace(
    ":username",
    encodeURIComponent(username)
  );
  return instance
    .post(url)
    .then((res) => ({ error: null, data: res.data.profile }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const unfollow = (username) => {
  const url = FOLLOW_PROFILE_PATH.replace(
    ":username",
    encodeURIComponent(username)
  );
  return instance
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
