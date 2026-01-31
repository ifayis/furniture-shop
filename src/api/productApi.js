import api from "./axios";

export const getAllProducts = async () => {
  const response = await api.get("/api/products/all");
  return response.data.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/products/single${id}`);
  return response.data.data;
};

export const getProductsByCategory = async (categoryId) => {
  const response = await api.get(`/api/products/${categoryId}`);
  return response.data.data;
};
