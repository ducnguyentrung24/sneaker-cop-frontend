import axiosInstance from './axios';

export const getStatisticSummary = async (params = {}) => {
    const res = await axiosInstance.get('/statistics/summary', { params });
    return res.data;
};

export const getRevenueChart = async (params = {}) => {
    const res = await axiosInstance.get('/statistics/revenue-chart', { params });
    return res.data;
};

export const getTopProducts = async (params = {}) => {
    const res = await axiosInstance.get('/statistics/top-products', { params });
    return res.data;
};

export const getRevenueByCategory = async (params = {}) => {
    const res = await axiosInstance.get('/statistics/revenue-categories', { params });
    return res.data;
};

export const getLowStockProducts = async (params = {}) => {
    const res = await axiosInstance.get('/statistics/low-stock-products', { params });
    return res.data;
};

export const getRecentOrders = async (params = {}) => {
    const res = await axiosInstance.get('/statistics/recent-orders', { params });
    return res.data;
};