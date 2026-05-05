import axiosInstance from "./axios";

export const checkoutFromCart = async (data) => {
    const res = await axiosInstance.post("/checkout/cart", data);
    return res.data;
};

export const checkoutFromBuyNow = async (data) => {
    const res = await axiosInstance.post("/checkout/buy-now", data);
    return res.data;
};