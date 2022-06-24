const LS_USERTOKEN_KEY = "user-jwt-token";

export const localStoragePlugin = (store) => {
  const token = window.localStorage.getItem(LS_USERTOKEN_KEY);
  if (token) {
    store.dispatch("setUserToken", JSON.parse(token));
  }

  store.subscribe((mutation, state) => {
    if (mutation.type === "setUser") {
      window.localStorage.setItem(
        LS_USERTOKEN_KEY,
        JSON.stringify(state.user.token)
      );
    }
  });
};
