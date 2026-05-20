import axiosInstance from "./axios";

export const getRecommendations = async (params = {}) => {
    const res = await axiosInstance.get("/recommendations/", { params });
    return res.data;
};