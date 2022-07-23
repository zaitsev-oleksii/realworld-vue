import { axiosClient } from "./axios-client";

const TAGS_PATH = "/tags";
const ARTICLES_PATH = "/articles";
const FEED_PATH = "/articles/feed";
const ARTICLE_PATH = "/articles/:slug";
const FAVORITE_ARTICLE_PATH = "/articles/:slug/favorite";

export const getTags = () =>
  axiosClient
    .get(TAGS_PATH)
    .then((res) => ({ data: res.data.tags }))
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
  return axiosClient
    .get(ARTICLES_PATH, { params: params })
    .then((res) => ({ data: res.data.articles }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const getArticlesFeed = (options = {}) => {
  const { limit, offset } = options;
  const params = new URLSearchParams({
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() })
  });
  return axiosClient
    .get(FEED_PATH, { params: params })
    .then((res) => ({ data: res.data.articles }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const getArticlesTotalCount = (options = {}) => {
  const { limit, offset, filterParams } = options;
  const { tag, author, favoritedBy } = filterParams ?? {};
  const params = new URLSearchParams({
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() }),
    ...(tag && { tag }),
    ...(author && { author }),
    ...(favoritedBy && { favorited: favoritedBy })
  });
  return axiosClient
    .get(ARTICLES_PATH, { params: params })
    .then((res) => ({ data: res.data.articlesCount }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const getArticlesFeedTotalCount = (options = {}) => {
  const { limit, offset } = options;
  const params = new URLSearchParams({
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() })
  });
  return axiosClient
    .get(FEED_PATH, { params: params })
    .then((res) => ({ data: res.data.articlesCount }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const createArticle = (articleData) => {
  const article = {
    title: articleData.title,
    description: articleData.description,
    body: articleData.body,
    tagList: articleData.tagList ?? []
  };
  return axiosClient
    .post(ARTICLES_PATH, { article: article })
    .then((res) => ({ data: res.data.article }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const getArticle = (slug) => {
  const url = ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return axiosClient
    .get(url)
    .then((res) => ({ data: res.data.article }))
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
  return axiosClient
    .put(url, { article: article })
    .then((res) => ({ data: res.data.article }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const deleteArticle = (slug) => {
  const url = ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return axiosClient
    .delete(url)
    .then((res) => ({ data: res.data }))
    .catch((err) => ({ error: err.response.data.errors }));
};

const favorite = async (slug) => {
  const url = FAVORITE_ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return axiosClient
    .post(url)
    .then((res) => ({ data: res.data.article }))
    .catch((err) => ({ error: err.response.data.errors }));
};

const unfavorite = async (slug) => {
  const url = FAVORITE_ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return axiosClient
    .delete(url)
    .then((res) => ({ data: res.data.article }))
    .catch((err) => ({ error: err.response.data.errors }));
};

const articlesAPI = {
  getTags,
  getArticles,
  getArticlesFeed,
  getArticlesTotalCount,
  getArticlesFeedTotalCount,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  favorite,
  unfavorite
};

export default articlesAPI;
