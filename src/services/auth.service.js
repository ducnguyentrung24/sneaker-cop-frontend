import axiosInstance from './axios';

export const login = async (data) => {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data.data;
};

export const register = async (data) => {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data,data;
};

export const forgotPassword = async (email) => {
    const res = await axiosInstance.post("/auth/forgot-password", { email });
    return res.data;
};

export const resetPassword = async (data) => {
    const res = await axiosInstance.post("/auth/reset-password", data);
    return res.data;
};