const LS_USERTOKEN_KEY = "user-jwt-token";

export const getToken = () => window.localStorage.getItem(LS_USERTOKEN_KEY);

export const saveToken = (token) => {
  window.localStorage.setItem(LS_USERTOKEN_KEY, token);
};

export const destroyToken = () => {
  window.localStorage.removeItem(LS_USERTOKEN_KEY);
};

export default { getToken, saveToken, destroyToken };
