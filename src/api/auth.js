const LOGIN_API_URL = "https://api.realworld.io/api/users/login";
const REGISTER_API_URL = "https://api.realworld.io/api/users";
const CURRENT_USER_API_URL = "https://api.realworld.io/api/user";

export const login = async (loginData) => {
  const { email, password } = loginData;
  const response = await fetch(LOGIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: {
        email,
        password
      }
    })
  }).then((res) => res.json());

  return response.user;
};

export const register = async (registerData) => {
  const { username, email, password } = registerData;

  const response = await fetch(REGISTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: {
        username,
        email,
        password
      }
    })
  }).then((res) => res.json());

  return response.user;
};

export const getCurrentUser = async (token) => {
  const response = await fetch(CURRENT_USER_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json());

  return response.user;
};

export const updateCurrentUser = async (token, userData) => {
  const response = await fetch(CURRENT_USER_API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      user: userData
    })
  }).then((res) => res.json());

  return response.user;
};

const authAPI = {
  login,
  register,
  getCurrentUser,
  updateCurrentUser
};

export default authAPI;
