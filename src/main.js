import { createApp } from "vue";
import App from "./App.vue";

import { store } from "./store";
import { router } from "./router";
import { VERIFY_AUTH } from "./store/action-types";

const app = createApp(App);

app.use(store);
app.use(router);

router.beforeEach(() => store.dispatch(VERIFY_AUTH));

app.mount("#app");
