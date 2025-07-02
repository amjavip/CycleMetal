// tokenService.js (archivo aparte)
let updateTokenCallback = null;

export const setUpdateTokenCallback = (callback) => {
  updateTokenCallback = callback;
};

export const notifyTokenUpdate = (newToken) => {
  if (updateTokenCallback) {
    updateTokenCallback(newToken);
  }
};
