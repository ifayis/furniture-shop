import api from "./axios";

export const addToCart = async (productId, quantity) => {
  const response = await api.post("/api/cart/add", {
    productId,
    quantity,
  });

  return response.data;
};

export const getMyCart = async () => {
  const response = await api.get("/api/cart/my-cart");
  return response.data.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await api.put("/api/cart/update", {
    productId,
    quantity,
  });

  return response.data;
};

export const removeCartItem = async (productId) => {
  const response = await api.delete(`/api/cart/remove/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/api/cart/clear");
  return response.data;
};
