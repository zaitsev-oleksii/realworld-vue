import { createRouter, createWebHashHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import RegisterPage from "./pages/RegisterPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";
import EditorPage from "./pages/EditorPage.vue";
import ArticlePage from "./pages/ArticlePage.vue";
import ProfilePage from "./pages/ProfilePage.vue";

const routes = [
  { name: "home", path: "/", component: HomePage },
  { name: "login", path: "/login", component: LoginPage },
  { name: "register", path: "/register", component: RegisterPage },
  { name: "settings", path: "/settings", component: SettingsPage },
  {
    name: "editor",
    path: "/editor/:slug?",
    component: EditorPage,
    props: true
  },
  {
    name: "article",
    path: "/article/:slug",
    component: ArticlePage,
    props: true
  },
  {
    name: "profile",
    path: "/profile/:username",
    component: ProfilePage,
    props: true
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
