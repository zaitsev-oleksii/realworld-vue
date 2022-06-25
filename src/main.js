import { createApp } from "vue";
import App from "./App.vue";

import { store } from "./store";
import { router } from "./router";
import { CHECK_AUTH } from "./store/action-types";

const app = createApp(App);

app.use(store);
app.use(router);

store.dispatch(CHECK_AUTH);

app.mount("#app");
