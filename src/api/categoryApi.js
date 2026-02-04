import api from "./axios";

export const getAllCategories = async () => {
  const response = await api.get("/api/categories/all");
  return response.data.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/api/categories/${id}`);
  return response.data.data;
};

