import axiosInstance from "./axios";

export const getDashboardSummary = async () => {
    const res = await axiosInstance.get("/dashboard");
    return res.data;
};

export const getRevenueStatistics = async (params = {}) => {
    const res = await axiosInstance.get("/dashboard/revenue-statistics", { params });
    return res.data;
};

export const getTopProducts = async (params = {}) => {
    const res = await axiosInstance.get("/dashboard/top-products", { params });
    return res.data;
};

export const getLowStockProducts = async (params = {}) => {
    const res = await axiosInstance.get("/dashboard/low-stock", { params });
    return res.data;
};

export const getPaymentStatistics = async (params = {}) => {
    const res = await axiosInstance.get("/dashboard/payment-statistics", { params });
    return res.data;
};

export const getCategoryStatistics = async (params = {}) => {
    const res = await axiosInstance.get("/dashboard/category-statistics", { params });
    return res.data;
};

export const getBrandStatistics = async (params = {}) => {
    const res = await axiosInstance.get("/dashboard/brand-statistics", { params });
    return res.data;
};