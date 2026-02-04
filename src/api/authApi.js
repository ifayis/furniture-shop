import api from "./axios";


export const signUp = async (payload) => {
  const response = await api.post("/api/auth/SignUp", payload);
  return response.data;
};

export const signIn = async (email, password) => {
  const response = await api.post("/api/auth/SignIn", {
    email,
    password,
  });

  return response.data.data;
};

export const logout = async () => {
  await api.post("/api/auth/logout");
};
