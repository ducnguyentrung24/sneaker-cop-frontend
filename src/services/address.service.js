import axiosInstance from "./axios";

export const getAddresses = async () => {
    const res = await axiosInstance.get("/addresses");
    return res.data;
};

export const setDefaultAddress = async (id) => {
    const res = await axiosInstance.patch(`/addresses/${id}/default`);
    return res.data;
};

export const createAddress = async (data) => {
    const res = await axiosInstance.post("/addresses", data);
    return res.data;
};

export const updateAddress = async (id, data) => {
    const res = await axiosInstance.put(`/addresses/${id}`, data);
    return res.data;
};

export const deleteAddress = async (id) => {
    const res = await axiosInstance.delete(`/addresses/${id}`);
    return res.data;
};