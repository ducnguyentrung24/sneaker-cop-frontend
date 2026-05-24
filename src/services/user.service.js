import axiosInstance from "./axios";

export const getProfile = async () => {
    const res = await axiosInstance.get("/users/profile");
    return res.data;
};

export const updateProfile = async (data) => {
    const res = await axiosInstance.patch("/users/profile", data);
    return res.data;
};

export const changePassword = async (data) => {
    const res = await axiosInstance.patch("/users/change-password", data);
    return res.data;
};

// Admin
export const getAllUsers = async (params = {}) => {
    const res = await axiosInstance.get("/users", { params });
    return res.data;
};

export const createUser = async (data) => {
    const res = await axiosInstance.post("/users", data);
    return res.data;
};

export const updateUser = async (id, data) => {
    const res = await axiosInstance.patch(`/users/${id}`, data);
    return res.data;
};

export const updateUserStatus = async (id, is_active) => {
    const res = await axiosInstance.patch(`/users/${id}/status`, { is_active });
    return res.data;
};