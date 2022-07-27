export const unknownError = { "unknown error": "" };

export const errorCatcher = (promise) =>
  promise.catch((err) => ({
    error: err.response?.data?.errors || unknownError
  }));
