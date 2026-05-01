import axiosInstance from "./axios";

export const getReviewsByProductId = async (productId, params = {}) => {
    const res = await axiosInstance.get(`/reviews/product/${productId}`,
        {
            params: params
        }
    );
    console.log("Review stats: ", res.data);
    return res.data;
};