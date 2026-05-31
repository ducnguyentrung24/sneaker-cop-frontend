import axiosInstance from "./axios";
export const getRevenueSummary = async (params = {}) => {
    const res = await axiosInstance.get('/reports/revenue-summary', { params });
    return res.data;
};

export const getRevenueByProduct = async (params = {}) => {
    const res = await axiosInstance.get('/reports/revenue-product', { params });
    return res.data;
};

export const getRevenueByBrand = async (params = {}) => {
    const res = await axiosInstance.get('/reports/revenue-brand', { params });
    return res.data;
};

export const getRevenueByCategory = async (params = {}) => {
    const res = await axiosInstance.get('/reports/revenue-category', { params });
    return res.data;
};

export const getRevenueOrders = async (params = {}) => {
    const res = await axiosInstance.get('/reports/revenue-order', { params });
    return res.data;
};

export const exportRevenueExcel = async (params = {}) => {
    const res = await axiosInstance.get('/reports/revenue-excel', { params, responseType: 'blob' });
    return res.data;
};