import { createStore } from "vuex";
import profileAPI from "./api/profile";

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
    setUser(state, userData) {
      const { email, username, bio, image, token } = userData;

      state.user.email = email;
      state.user.username = username;
      state.user.bio = bio;
      state.user.token = token;
      state.user.image = image;
    }
  },
  actions: {
    async setUser({ commit }, userData) {
      const { email, username, bio, token } = userData;

      const profile = await profileAPI.getProfile(username);

      commit("setUser", {
        email,
        username,
        bio,
        token,
        image: profile.image
      });
    }
  }
});
