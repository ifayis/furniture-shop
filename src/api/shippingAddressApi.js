import api from "./axios";

export const getMyShippingAddresses = async () => {
  const res = await api.get("/api/shipping-addresses/my");
  return res.data.data;
};

export const createShippingAddress = async (payload) => {
  const res = await api.post("/api/shipping-addresses", payload);
  return res.data.data;
};

export const updateShippingAddress = async (addressId, payload) => {
  const res = await api.put(`/api/shipping-addresses/${addressId}`, payload);
  return res.data.data;
};
