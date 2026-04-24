import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('Unauthorized - redirecting to login');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;