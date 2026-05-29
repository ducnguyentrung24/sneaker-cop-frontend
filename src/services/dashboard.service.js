import axiosInstance from "./axios";

export const getDashboardSummary = async (params = {}) => {
    const res = await axiosInstance.get("/dashboard", { params });
    return res.data;
};

export const getRevenueStatistics = async () => {
    const res = await axiosInstance.get("/dashboard/revenue-statistics");
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

export const getCategoryStatistics = async () => {
    const res = await axiosInstance.get("/dashboard/category-statistics");
    return res.data;
};

export const getBrandStatistics = async () => {
    const res = await axiosInstance.get("/dashboard/brand-statistics");
    return res.data;
};