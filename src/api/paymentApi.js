import api from "./axios";

export const makePayment = async (paymentMethod = "Cash On Delivery") => {
  const response = await api.post("/api/checkout/payment", {
    paymentMethod,
  });

  return response.data;
};
