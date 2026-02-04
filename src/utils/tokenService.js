export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () =>
  localStorage.getItem("accessToken");

export const getRefreshToken = () =>
  localStorage.getItem("refreshToken");

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const getDecodedToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const getUserRole = () => {
  const decoded = getDecodedToken();
  return decoded?.Role ?? null;
};

export const getUserId = () => {
  const decoded = getDecodedToken();
  return decoded?.UID ?? null;
};
