import { createStore } from "vuex";

import tokenService from "../token-service";

import { SET_USER, CLEAR_USER, SET_ERRORS } from "./mutation-types";
import { LOGIN, LOGOUT, CHECK_AUTH } from "./action-types";

import profileAPI from "@/api/profile";
import authAPI from "@/api/auth";

export const store = createStore({
  state() {
    return {
      user: {
        email: "",
        username: "",
        bio: "",
        image: "",
        token: ""
      },
      errors: null
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
    },
    [SET_ERRORS](state, errors) {
      state.errors = errors;
    }
  },
  actions: {
    async [LOGIN]({ commit }, credentials) {
      const { error, data: userData } = await authAPI.login(credentials);
      console.log(error);
      if (error) {
        commit(SET_ERRORS, error);
      } else {
        const { email, username, token } = userData;
        const profile = (await profileAPI.getProfile(username)).data;
        commit(SET_USER, {
          email,
          username,
          bio: profile.bio,
          token,
          image: profile.image
        });
        commit(SET_ERRORS, null);
      }
    },
    async [LOGOUT]({ commit }) {
      commit(CLEAR_USER);
    },
    async [CHECK_AUTH]({ commit }) {
      const token = tokenService.getToken();
      if (token) {
        const { error, data: userData } = await authAPI.getCurrentUser();
        if (error) {
          commit(SET_ERRORS, error);
        } else {
          const { email, username } = userData;
          const profile = (await profileAPI.getProfile(username)).data;
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
  }
});
