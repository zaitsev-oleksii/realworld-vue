import { createRouter, createWebHashHistory } from "vue-router";

const HomeView = () => import("./views/Home.vue");
const LoginView = () => import("./views/Login.vue");
const RegisterView = () => import("./views/Register.vue");
const SettingsView = () => import("./views/Settings.vue");
const ArticleEditorView = () => import("./views/ArticleEditor.vue");
const ArticleView = () => import("./views/Article.vue");
const ProfileView = () => import("./views/Profile.vue");
const GlobalFeed = () => import("./views/home/GlobalFeed.vue");
const PersonalFeed = () => import("./views/home/PersonalFeed.vue");
const TagFeed = () => import("./views/home/TagFeed.vue");
const CreatedArticles = () => import("./views/profile/CreatedArticles.vue");
const FavoritedArticles = () => import("./views/profile/FavoritedArticles.vue");

const routes = [
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "home" }
  },
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
    path: "/@:username",
    component: ProfileView,
    props: true,
    children: [
      {
        name: "profile",
        path: "",
        props: true,
        component: CreatedArticles
      },
      {
        name: "favorited-articles",
        path: "favorited",
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
