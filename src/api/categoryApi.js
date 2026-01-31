import api from "./axios";

export const getAllCategories = async () => {
  const response = await api.get("/api/categories/all");
  return response.data.data;
};
