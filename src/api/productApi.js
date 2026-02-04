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

export const addProduct = async (payload) => {
  const response = await api.post("/api/products/Add", payload);
  return response.data;
};

export const updateProduct = async (id, payload) => {
  const response = await api.put(`/api/products/Update/${id}`, payload);
  return response.data;
};

export const deactivateProduct = async (id) => {
  const response = await api.put(`/api/products/Deactivate/${id}`);
  return response.data;
};

export const activateProduct = async (id) => {
  const response = await api.put(`/api/products/Activate/${id}`);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/Delete/${id}`);
  return response.data;
};

export const clearProducts = async () => {
  const response = await api.delete("/api/products/Clear");
  return response.data;
};
