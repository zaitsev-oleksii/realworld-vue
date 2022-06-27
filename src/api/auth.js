import axios from "axios";
import tokenService from "../token-service";

const BASE_API_URL = "https://api.realworld.io/api";

const LOGIN_PATH = "/users/login";
const REGISTER_PATH = "/users";
const CURRENT_USER_PATH = "/user";

const authToken = tokenService.getToken();

const instance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    ...(authToken && { Authorization: `Bearer ${authToken} ` })
  }
});

export const login = (credentials) => {
  const user = {
    email: credentials.email,
    password: credentials.password
  };
  return instance
    .post(LOGIN_PATH, { user: user })
    .then((res) => ({ error: null, data: res.data.user }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const register = (registerData) => {
  const user = {
    username: registerData.username || "",
    email: registerData.email || "",
    password: registerData.password || ""
  };
  return instance
    .post(REGISTER_PATH, { user: user })
    .then((res) => ({ error: null, data: res.data.user }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const getCurrentUser = () =>
  instance
    .get(CURRENT_USER_PATH)
    .then((res) => ({ error: null, data: res.data.user }))
    .catch((err) => ({ error: err.response.data.errors }));

export const updateCurrentUser = (userData) => {
  const user = {
    ...(userData.image && { image: userData.image }),
    ...(userData.username && { username: userData.username }),
    ...(userData.bio && { bio: userData.bio }),
    ...(userData.email && { email: userData.email }),
    ...(userData.password && { password: userData.password })
  };

  return instance
    .put(CURRENT_USER_PATH, { user: user })
    .then((res) => ({ error: null, data: res.data.user }))
    .catch((err) => ({ error: err.response.data.errors }));
};

const authAPI = {
  login,
  register,
  getCurrentUser,
  updateCurrentUser
};

export default authAPI;
