import axiosInstance from "./axios";

export const getProducts = async (params = {}) => {
    const res = await axiosInstance.get("/products", { params });
    return res.data;
};

export const getProductById = async (id) => {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
};

export const createProduct = async (data) => {
    const res = await axiosInstance.post("/products", data);
    return res.data;
};

export const updateProduct = async (id, data) => {
    const res = await axiosInstance.patch(`/products/${id}`, data);
    return res.data;
};

export const deleteProduct = async (id) => {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
};