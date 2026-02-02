import api from "./axios";

export const getCheckout = async () => {
  const response = await api.get("/api/checkout");
  return response.data.data;
};
