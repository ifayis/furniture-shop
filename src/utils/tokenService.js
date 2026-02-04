export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

export const getDecodedToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const getUserRole = () => {
  const decoded = getDecodedToken();
  return decoded?.Role || null;
};

export const getUserId = () => {
  const decoded = getDecodedToken();
  return decoded?.UID || null;
};

