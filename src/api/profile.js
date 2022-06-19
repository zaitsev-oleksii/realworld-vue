const BASE_API_URL = "https://api.realworld.io/api/profiles";

export const getProfile = async (username) => {
  const requestURL = `${BASE_API_URL}/${username}`;

  const response = await fetch(requestURL).then((res) => res.json());

  return response.profile;
};

export const follow = async (token, username) => {
  const requestURL = `${BASE_API_URL}/${username}/follow`;

  const response = await fetch(requestURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json());

  return response.profile;
};

export const unfollow = async (token, username) => {
  const requestURL = `${BASE_API_URL}/${username}/follow`;

  const response = await fetch(requestURL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json());

  return response.profile;
};

const profileAPI = {
  getProfile,
  follow,
  unfollow
};

export default profileAPI;
