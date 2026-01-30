import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "./tokenService";

export const getUserFromToken = () => {
  const token = getAccessToken();

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      userId: decoded.UID,
      role: decoded.Role,
      email: decoded.Email,
    };
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
