import axios from "axios";
import tokenService from "../token-service";

const BASE_API_URL = "https://api.realworld.io/api";

export const axiosClient = axios.create({
  baseURL: BASE_API_URL
});

axiosClient.interceptors.request.use((config) => {
  const authToken = tokenService.getToken();
  if (authToken) {
    config.headers.common = { Authorization: `Bearer ${authToken}` };
  } else {
    config.headers.common = {};
  }
  return config;
});
