import api from "./axios";

export const getAllUsers = async () => {
  const res = await api.get("/api/users/All");
  return res.data?.data ?? [];
};

export const getUserById = async (userId) => {
  if (!userId) throw new Error("UserId is required");
  const res = await api.get(`/api/users/Individual/${userId}`);
  return res.data?.data ?? null;
};

export const blockUser = async (userId) => {
  if (!userId) throw new Error("UserId is required");
  const res = await api.put(`/api/users/Block/${userId}`);
  return res.data;
};

export const unblockUser = async (userId) => {
  if (!userId) throw new Error("UserId is required");
  const res = await api.put(`/api/users/Unblock/${userId}`);
  return res.data;
};
