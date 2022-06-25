const BASE_API_URL = "https://api.realworld.io/api";
const ARTICLES_API_URL = `${BASE_API_URL}/articles`;
const FEED_API_URL = `${BASE_API_URL}/articles/feed`;

export const getTags = async () => {
  const response = await fetch(`${BASE_API_URL}/tags`).then((res) =>
    res.json()
  );

  return response.tags;
};

export const getArticles = async ({
  limit = 10,
  offset = 0,
  filterParams = {},
  token
}) => {
  const { tag, author, favoritedBy } = filterParams ?? {};

  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    ...(tag && { tag }),
    ...(author && { author }),
    ...(favoritedBy && { favorited: favoritedBy })
  });

  const response = await fetch(
    `${ARTICLES_API_URL}?${queryParams.toString()}`,
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  ).then((res) => res.json());

  return response.articles;
};

export const getArticlesFeed = async ({ limit = 10, offset = 0, token }) => {
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString()
  });

  const response = await fetch(`${FEED_API_URL}?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json());

  return response.articles;
};

export const createArticle = async ({ articleData, token }) => {
  const response = await fetch(ARTICLES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      article: {
        title: articleData.title,
        description: articleData.description,
        body: articleData.body,
        tagList: articleData.tagList ?? []
      }
    })
  }).then((res) => res.json());

  return response.article;
};

export const getArticle = async ({ slug, token }) => {
  const queryURL = `${ARTICLES_API_URL}/${slug}`;

  const response = await fetch(queryURL, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }).then((res) => res.json());

  return response.article;
};

export const updateArticle = async ({ slug, articleData, token }) => {
  const queryURL = `${ARTICLES_API_URL}/${slug}`;

  const response = await fetch(queryURL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      article: {
        title: articleData.title,
        description: articleData.description,
        body: articleData.body,
        tagList: articleData.tagList ?? []
      }
    })
  }).then((res) => res.json());

  return response.article;
};

export const deleteArticle = async ({ slug, token }) => {
  const queryURL = `${ARTICLES_API_URL}/${slug}`;

  const response = await fetch(queryURL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json());

  return response;
};

const favorite = async ({ slug, token }) => {
  const queryURL = `${ARTICLES_API_URL}/${slug}/favorite`;

  const response = await fetch(queryURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json());

  return response.article;
};

const unfavorite = async ({ slug, token }) => {
  const queryURL = `${ARTICLES_API_URL}/${slug}/favorite`;

  const response = await fetch(queryURL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json());

  return response.article;
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
