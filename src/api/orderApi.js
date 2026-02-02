import api from "./axios";

export const getMyOrders = async () => {
  const res = await api.get("/api/orders/my-orders");
  return res.data.data;
};

export const cancelOrder = async (orderId) => {
  const res = await api.put(`/api/orders/cancel/${orderId}`);
  return res.data;
};
