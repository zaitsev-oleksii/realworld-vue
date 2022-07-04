import { axiosClient } from "./axios-client";

const COMMENTS_PATH = "articles/:slug/comments";
const DELETE_COMMENT_PATH = "articles/:slug/comments/:id";

export const getComments = (slug) => {
  const url = COMMENTS_PATH.replace(":slug", encodeURIComponent(slug));
  return axiosClient
    .get(url)
    .then((res) => ({ error: null, data: res.data.comments }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const createComment = ({ slug, commentText }) => {
  const url = COMMENTS_PATH.replace(":slug", encodeURIComponent(slug));
  return axiosClient
    .post(url, { comment: { body: commentText } })
    .then((res) => ({ error: null, data: res.data.comment }))
    .catch((err) => ({ error: err.response.data.errors }));
};

export const deleteComment = ({ slug, id }) => {
  const url = DELETE_COMMENT_PATH.replace(
    ":slug",
    encodeURIComponent(slug)
  ).replace(":id", encodeURIComponent(id));
  return axiosClient
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
