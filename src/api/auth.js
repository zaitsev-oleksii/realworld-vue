import { axiosClient } from "./axios-client";

const LOGIN_PATH = "/users/login";
const REGISTER_PATH = "/users";
const CURRENT_USER_PATH = "/user";

export const login = (credentials) => {
  const user = {
    email: credentials.email,
    password: credentials.password
  };
  return axiosClient
    .post(LOGIN_PATH, { user: user })
    .then((res) => ({ data: res.data.user }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const register = (registerData) => {
  const user = {
    username: registerData.username || "",
    email: registerData.email || "",
    password: registerData.password || ""
  };
  return axiosClient
    .post(REGISTER_PATH, { user: user })
    .then((res) => ({ data: res.data.user }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const getCurrentUser = () =>
  axiosClient
    .get(CURRENT_USER_PATH)
    .then((res) => ({ data: res.data.user }))
    .catch((err) => ({ error: err.response.data.errors }));

export const updateCurrentUser = (userData) => {
  const user = {
    ...(userData.image && { image: userData.image }),
    ...(userData.username && { username: userData.username }),
    ...(userData.bio && { bio: userData.bio }),
    ...(userData.email && { email: userData.email }),
    ...(userData.password && { password: userData.password })
  };

  return axiosClient
    .put(CURRENT_USER_PATH, { user: user })
    .then((res) => ({ data: res.data.user }))
    .catch((err) => ({ error: err.response.data.errors }));
};

const authAPI = {
  login,
  register,
  getCurrentUser,
  updateCurrentUser
};

export default authAPI;
