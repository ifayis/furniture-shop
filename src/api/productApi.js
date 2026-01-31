import api from "./axios";

export const getAllProducts = async () => {
  const response = await api.get("/api/products/all");
  return response.data.data;
};
