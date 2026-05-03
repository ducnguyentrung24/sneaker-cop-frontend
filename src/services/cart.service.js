import axiosInstance from './axios';

export const getCart = async () => {
    const res = await axiosInstance.get('/cart');
    return res.data;
};

export const addToCart = async (data) => {
    const res = await axiosInstance.post('/cart', data);
    return res.data;
};

export const updateCartItem = async (id, data) => {
    const res = await axiosInstance.put(`/cart/${id}`, data);
    return res.data;
};

export const deleteCartItem = async (id) => {
    const res = await axiosInstance.delete(`/cart/${id}`);
    return res.data;
};

export const deleteManyCartItems = async (ids) => {
    const res = await axiosInstance.delete('/cart', { 
        data: { ids } 
    });
    return res.data;
};