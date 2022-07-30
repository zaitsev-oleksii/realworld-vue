import { createStore } from "vuex";

import tokenService from "../token-service";

import { SET_USER, CLEAR_USER, SET_ERROR } from "./mutation-types";
import { LOGIN, LOGOUT, UPDATE_USER_DATA, VERIFY_AUTH } from "./action-types";

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
        token: "",
        authenticated: false
      },
      errors: null
    };
  },
  getters: {
    isAuthenticated(state) {
      return state.user.authenticated ? true : false;
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

      state.user.authenticated = true;
      tokenService.saveToken(state.user.token);
    },
    [CLEAR_USER](state) {
      state.user = {};
      tokenService.destroyToken();
    },
    [SET_ERROR](state, error) {
      state.errors = error;
    }
  },
  actions: {
    async [LOGIN]({ commit }, credentials) {
      const { error, data: userData } = await authAPI.login(credentials);
      if (error) {
        commit(SET_ERROR, error);
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
        commit(SET_ERROR, null);
      }
    },
    async [LOGOUT]({ commit }) {
      commit(CLEAR_USER);
    },
    async [UPDATE_USER_DATA]({ commit }, userData) {
      const { error, data: updatedUserData } = await authAPI.updateCurrentUser(
        userData
      );
      if (error) {
        commit(SET_ERROR, error);
      } else {
        const { email, username, token } = updatedUserData;
        const profile = (await profileAPI.getProfile(username)).data;
        commit(SET_USER, {
          email,
          username,
          bio: profile.bio,
          token,
          image: profile.image
        });
        return {
          email,
          username,
          bio: profile.bio,
          token,
          image: profile.image
        };
      }
    },
    async [VERIFY_AUTH]({ commit }) {
      const token = tokenService.getToken();
      if (token) {
        const { error, data: userData } = await authAPI.getCurrentUser();
        if (error) {
          commit(SET_ERROR, error);
          tokenService.destroyToken();
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
