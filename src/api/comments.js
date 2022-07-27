import { axiosClient } from "./axios-client";
import { errorCatcher } from "./error-catcher";

const COMMENTS_PATH = "articles/:slug/comments";
const DELETE_COMMENT_PATH = "articles/:slug/comments/:id";

export const getComments = (slug) => {
  const url = COMMENTS_PATH.replace(":slug", encodeURIComponent(slug));
  return errorCatcher(
    axiosClient.get(url).then((res) => ({ data: res.data.comments }))
  );
};

export const createComment = ({ slug, commentText }) => {
  const url = COMMENTS_PATH.replace(":slug", encodeURIComponent(slug));
  return errorCatcher(
    axiosClient
      .post(url, { comment: { body: commentText } })
      .then((res) => ({ data: res.data.comment }))
  );
};

export const deleteComment = ({ slug, id }) => {
  const url = DELETE_COMMENT_PATH.replace(
    ":slug",
    encodeURIComponent(slug)
  ).replace(":id", encodeURIComponent(id));
  return errorCatcher(
    axiosClient.delete(url).then((res) => ({ data: res.data }))
  );
};

const commentsAPI = {
  getComments,
  createComment,
  deleteComment
};

export default commentsAPI;
