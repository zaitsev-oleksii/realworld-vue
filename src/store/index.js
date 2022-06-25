import { createStore } from "vuex";

import authAPI from "../api/auth";
import profileAPI from "../api/profile";

import tokenService from "../token-service";

import { SET_USER, CLEAR_USER } from "./mutation-types";
import { LOGIN, LOGOUT, CHECK_AUTH } from "./action-types";

export const store = createStore({
  state() {
    return {
      user: {
        email: "",
        username: "",
        bio: "",
        image: "",
        token: ""
      }
    };
  },
  getters: {
    isAuthorized(state) {
      return state.user.token ? true : false;
    }
  },
  mutations: {
    [SET_USER](state, userData) {
      const { email, username, bio, image, token } = userData;

      state.user.email = email;
      state.user.username = username;
      state.user.bio = bio;
      state.user.token = token;
      state.user.image = image;

      tokenService.saveToken(state.user.token);
    },
    [CLEAR_USER](state) {
      state.user = {};
      tokenService.destroyToken();
    }
  },
  actions: {
    async [LOGIN]({ commit }, credentials) {
      const userData = await authAPI.login(credentials);
      const { email, username, token } = userData;
      const profile = await profileAPI.getProfile({ username: username });
      commit(SET_USER, {
        email,
        username,
        bio: profile.bio,
        token,
        image: profile.image
      });
    },
    async [LOGOUT]({ commit }) {
      commit(CLEAR_USER);
    },
    async [CHECK_AUTH]({ commit }) {
      const token = tokenService.getToken();
      if (token) {
        const userData = await authAPI.getCurrentUser({ token: token });
        const { email, username } = userData;
        const profile = await profileAPI.getProfile({ username: username });
        commit(SET_USER, {
          email,
          username,
          bio: profile.bio,
          token,
          image: profile.image
        });
      }
    }
  }
});
