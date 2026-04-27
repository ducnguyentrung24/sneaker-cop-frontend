import axiosInstance from "./axios";

export const getProducts = async (params = {}) => {
    const res = await axiosInstance.get("/products", { params });
    return res.data;
};