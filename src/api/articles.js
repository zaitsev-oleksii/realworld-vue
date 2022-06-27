import axios from "axios";
import tokenService from "../token-service";

const BASE_API_URL = "https://api.realworld.io/api";

const TAGS_PATH = "/tags";
const ARTICLES_PATH = "/articles";
const FEED_PATH = "/articles/feed";
const ARTICLE_PATH = "/articles/:slug";
const FAVORITE_ARTICLE_PATH = "/articles/:slug/favorite";

const authToken = tokenService.getToken();

const instance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    ...(authToken && { Authorization: `Bearer ${authToken} ` })
  }
});

export const getTags = () =>
  instance
    .get(TAGS_PATH)
    .then((res) => ({ error: null, data: res.data.tags }))
    .catch((err) => ({ error: err.response.data.errors }));

export const getArticles = (options = {}) => {
  const { limit, offset, filterParams } = options;
  const { tag, author, favoritedBy } = filterParams ?? {};
  const params = new URLSearchParams({
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() }),
    ...(tag && { tag }),
    ...(author && { author }),
    ...(favoritedBy && { favorited: favoritedBy })
  });
  return instance
    .get(ARTICLES_PATH, { params: params })
    .then((res) => ({ error: null, data: res.data.articles }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const getArticlesFeed = (options = {}) => {
  const { limit, offset } = options;
  const params = new URLSearchParams({
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() })
  });
  return instance
    .get(FEED_PATH, { params: params })
    .then((res) => ({ error: null, data: res.data.articles }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const createArticle = (articleData) => {
  const article = {
    title: articleData.title,
    description: articleData.description,
    body: articleData.body,
    tagList: articleData.tagList ?? []
  };
  return instance
    .post(ARTICLES_PATH, { article: article })
    .then((res) => ({ error: null, data: res.data.article }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const getArticle = (slug) => {
  const url = ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return instance
    .get(url)
    .then((res) => ({ error: null, data: res.data.article }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const updateArticle = ({ slug, articleData }) => {
  const url = ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  const article = {
    title: articleData.title,
    description: articleData.description,
    body: articleData.body,
    tagList: articleData.tagList || []
  };
  return instance
    .put(url, { article: article })
    .then((res) => ({ error: null, data: res.data.article }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const deleteArticle = (slug) => {
  const url = ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return instance
    .delete(url)
    .then((res) => ({ error: null, data: res.data }))
    .catch((err) => ({ error: err.response.data.errors }));
};

const favorite = async (slug) => {
  const url = FAVORITE_ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return instance
    .post(url)
    .then((res) => ({ error: null, data: res.data.article }))
    .catch((err) => ({ error: err.response.data.errors }));
};

const unfavorite = async (slug) => {
  const url = FAVORITE_ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return instance
    .delete(url)
    .then((res) => ({ error: null, data: res.data.article }))
    .catch((err) => ({ error: err.response.data.errors }));
};

const articlesAPI = {
  getTags,
  getArticles,
  getArticlesFeed,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  favorite,
  unfavorite
};

export default articlesAPI;
