import { createRouter, createWebHashHistory } from "vue-router";

import HomeView from "./views/Home.vue";
import LoginView from "./views/Login.vue";
import RegisterView from "./views/Register.vue";
import SettingsView from "./views/Settings.vue";
import ArticleEditorView from "./views/ArticleEditor.vue";
import ArticleView from "./views/Article.vue";
import ProfileView from "./views/Profile.vue";
import GlobalFeed from "./views/home/GlobalFeed.vue";
import PersonalFeed from "./views/home/PersonalFeed.vue";
import TagFeed from "./views/home/TagFeed.vue";
import CreatedArticles from "./views/profile/CreatedArticles.vue";
import FavoritedArticles from "./views/profile/FavoritedArticles.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
    children: [
      {
        name: "home",
        path: "/",
        component: GlobalFeed
      },
      {
        name: "personal-feed",
        path: "/feed",
        component: PersonalFeed,
        meta: { requiresAuth: true }
      },
      {
        name: "tag-feed",
        path: "/tag/:tag",
        component: TagFeed,
        props: true
      }
    ]
  },
  { name: "login", path: "/login", component: LoginView },
  { name: "register", path: "/register", component: RegisterView },
  {
    name: "settings",
    path: "/settings",
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    name: "editor",
    path: "/editor/:slug?",
    component: ArticleEditorView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    name: "article",
    path: "/article/:slug",
    component: ArticleView,
    props: true
  },
  {
    path: "/profile/:username",
    component: ProfileView,
    props: true,
    children: [
      {
        name: "profile",
        path: "/:username/",
        props: true,
        component: CreatedArticles
      },
      {
        name: "favorited-articles",
        path: "/:username/favorited",
        props: true,
        component: FavoritedArticles
      }
    ]
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
