import axiosInstance from "./axios";

export const getReviewsByProductId = async (productId) => {
    const res = await axiosInstance.get(`/reviews/product/${productId}`);
    console.log("Review stats: ", res.data);
    return res.data;
};