import axiosInstance from "./axios";

export const getReviewsByProductId = async (productId, params = {}) => {
    const res = await axiosInstance.get(`/reviews/product/${productId}`,
        {
            params: params
        }
    );
    return res.data;
};

export const getReviewsByOrder = async (orderId) => {
    const res = await axiosInstance.get(`/reviews/order/${orderId}`);
    return res.data;
};

export const createReview = async (data) => {
    const res = await axiosInstance.post(`/reviews`, data);
    return res.data;
};