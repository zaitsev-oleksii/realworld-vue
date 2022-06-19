import { createStore } from "vuex";

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
  mutations: {
    setUser(state, userData) {
      const { email, username, bio, image, token } = userData;

      state.user.email = email;
      state.user.username = username;
      state.user.bio = bio;
      state.user.image = image;
      state.user.token = token;
    }
  }
});
