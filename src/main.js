import { createApp } from "vue";
import App from "./App.vue";

import { store } from "./store";
import { router } from "./router";
import { VERIFY_AUTH } from "./store/action-types";

import api from "./api";

const app = createApp(App);

app.use(store);
app.use(router);

app.provide("authAPI", api.authAPI);
app.provide("profileAPI", api.profileAPI);
app.provide("articlesAPI", api.articlesAPI);
app.provide("commentsAPI", api.commentsAPI);

router.beforeEach(async (to) => {
  await store.dispatch(VERIFY_AUTH);
  if (to.meta.requiresAuth && !store.getters.isAuthorized) {
    router.push({ name: "login" });
  }
});

app.mount("#app");
