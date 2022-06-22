const BASE_API_URL = "https://api.realworld.io/api/articles";

export const getComments = async (slug, token) => {
  const requestURL = `${BASE_API_URL}/${slug}/comments`;
  const response = await fetch(requestURL, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }).then((res) => res.json());

  return response.comments;
};

export const createComment = async (slug, commentData, token) => {
  const requestURL = `${BASE_API_URL}/${slug}/comments`;

  const response = await fetch(requestURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      comment: {
        body: commentData.body
      }
    })
  }).then((res) => res.json());

  return response.comment;
};

export const deleteComment = async (slug, id, token) => {
  const requestURL = `${BASE_API_URL}/${slug}/comments/${id}`;

  const response = await fetch(requestURL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json());

  return response;
};

const commentsAPI = {
  getComments,
  createComment,
  deleteComment
};

export default commentsAPI;
