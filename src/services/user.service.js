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