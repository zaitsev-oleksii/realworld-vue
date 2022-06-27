import { createRouter, createWebHashHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import RegisterPage from "./pages/RegisterPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";
import EditorPage from "./pages/EditorPage.vue";
import ArticlePage from "./pages/ArticlePage.vue";
import ProfilePage from "./pages/ProfilePage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/settings", component: SettingsPage },
  { path: "/editor", component: EditorPage },
  { path: "/editor/:slug", component: EditorPage, props: true },
  { path: "/article/:slug", component: ArticlePage, props: true },
  { path: "/profile/:username", component: ProfilePage, props: true }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
