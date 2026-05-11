import axiosInstance from "./axios";

export const checkoutFromCart = async (data) => {
    const res = await axiosInstance.post("/orders/checkout/cart", data);
    return res.data;
};

export const checkoutFromBuyNow = async (data) => {
    const res = await axiosInstance.post("/orders/checkout/buy-now", data);
    return res.data;
};

export const getMyOrders = async (params = {}) => {
    const res = await axiosInstance.get("/orders", { params });
    return res.data;
};