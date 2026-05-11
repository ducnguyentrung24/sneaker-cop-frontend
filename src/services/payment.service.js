import axiosInstance from "./axios";

export const createVNPayPayment = async (orderId) => {
    const res = await axiosInstance.get(`/payment/vnpay/${orderId}`);
    return res.data;
};