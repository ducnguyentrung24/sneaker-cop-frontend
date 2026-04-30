import axiosInstance from "./axios";

export const getBrands = async () => {
    const res = await axiosInstance.get("/brands");
    return res.data;
};