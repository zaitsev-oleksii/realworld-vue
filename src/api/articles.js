import { axiosClient } from "./axios-client";
import { errorCatcher } from "./error-catcher";

const TAGS_PATH = "/tags";
const ARTICLES_PATH = "/articles";
const FEED_PATH = "/articles/feed";
const ARTICLE_PATH = "/articles/:slug";
const FAVORITE_ARTICLE_PATH = "/articles/:slug/favorite";

export const getTags = () =>
  errorCatcher(
    axiosClient.get(TAGS_PATH).then((res) => ({ data: res.data.tags }))
  );

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
  return errorCatcher(
    axiosClient
      .get(ARTICLES_PATH, { params: params })
      .then((res) => ({ data: res.data.articles }))
  );
};

export const getArticlesFeed = (options = {}) => {
  const { limit, offset } = options;
  const params = new URLSearchParams({
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() })
  });
  return errorCatcher(
    axiosClient
      .get(FEED_PATH, { params: params })
      .then((res) => ({ data: res.data.articles }))
  );
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
  return errorCatcher(
    axiosClient
      .get(ARTICLES_PATH, { params: params })
      .then((res) => ({ data: res.data.articlesCount }))
  );
};

export const getArticlesFeedTotalCount = (options = {}) => {
  const { limit, offset } = options;
  const params = new URLSearchParams({
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() })
  });
  return errorCatcher(
    axiosClient
      .get(FEED_PATH, { params: params })
      .then((res) => ({ data: res.data.articlesCount }))
  );
};

export const createArticle = (articleData) => {
  const article = {
    title: articleData.title,
    description: articleData.description,
    body: articleData.body,
    tagList: articleData.tagList ?? []
  };
  return errorCatcher(
    axiosClient
      .post(ARTICLES_PATH, { article: article })
      .then((res) => ({ data: res.data.article }))
  );
};

export const getArticle = (slug) => {
  const url = ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return errorCatcher(
    axiosClient.get(url).then((res) => ({ data: res.data.article }))
  );
};

export const updateArticle = ({ slug, articleData }) => {
  const url = ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  const article = {
    title: articleData.title,
    description: articleData.description,
    body: articleData.body,
    tagList: articleData.tagList || []
  };
  return errorCatcher(
    axiosClient
      .put(url, { article: article })
      .then((res) => ({ data: res.data.article }))
  );
};

export const deleteArticle = (slug) => {
  const url = ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return errorCatcher(
    axiosClient.delete(url).then((res) => ({ data: res.data }))
  );
};

const favorite = async (slug) => {
  const url = FAVORITE_ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return errorCatcher(
    axiosClient.post(url).then((res) => ({ data: res.data.article }))
  );
};

const unfavorite = async (slug) => {
  const url = FAVORITE_ARTICLE_PATH.replace(":slug", encodeURIComponent(slug));
  return errorCatcher(
    axiosClient.delete(url).then((res) => ({ data: res.data.article }))
  );
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
