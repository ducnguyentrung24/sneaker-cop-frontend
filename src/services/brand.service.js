import axiosInstance from "./axios";

export const getBrands = async (params = {}) => {
    const res = await axiosInstance.get("/brands", { params });
    return res.data;
};

// Admin
export const createBrand = async (data) => {
    const res = await axiosInstance.post("/brands", data);
    return res.data;
};

export const updateBrand = async (id, data) => {
    const res = await axiosInstance.patch(`/brands/${id}`, data);
    return res.data;
};

export const deleteBrand = async (id) => {
    const res = await axiosInstance.delete(`/brands/${id}`);
    return res.data;
};