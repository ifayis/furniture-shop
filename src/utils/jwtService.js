import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "./tokenService";

export const getUserFromToken = () => {
  const token = getAccessToken();

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      FullName: decoded.Name,
      Role: decoded.Role,
      Email: decoded.Email,
      expiresAt: decoded.exp,
    };
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
