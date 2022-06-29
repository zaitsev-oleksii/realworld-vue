import axios from "axios";
import tokenService from "../token-service";

const BASE_API_URL = "https://api.realworld.io/api";
const COMMENTS_PATH = "articles/:slug/comments";
const DELETE_COMMENT_PATH = "articles/:slug/comments/:id";

const authToken = tokenService.getToken();

const instance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    ...(authToken && { Authorization: `Bearer ${authToken} ` })
  }
});

export const getComments = (slug) => {
  const url = COMMENTS_PATH.replace(":slug", encodeURIComponent(slug));
  return instance
    .get(url)
    .then((res) => ({ error: null, data: res.data.comments }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const createComment = ({ slug, commentText }) => {
  const url = COMMENTS_PATH.replace(":slug", encodeURIComponent(slug));
  return instance
    .post(url, { comment: { body: commentText } })
    .then((res) => ({ error: null, data: res.data.comment }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const deleteComment = ({ slug, id }) => {
  const url = DELETE_COMMENT_PATH.replace(
    ":slug",
    encodeURIComponent(slug)
  ).replace(":id", encodeURIComponent(id));
  return instance
    .delete(url)
    .then((res) => ({ error: null, data: res.data }))
    .catch((err) => ({ error: err.response.data.errors }));
};

const commentsAPI = {
  getComments,
  createComment,
  deleteComment
};

export default commentsAPI;
