// src/components/axiosInstance.js


import axios from 'axios';
import getCsrfToken from '../utils/csrf';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 确保 cookies 被发送
});

// 在请求拦截器中设置 CSRF token
axiosInstance.interceptors.request.use((config) => {
    const token = getCsrfToken();
    if (token) {
        config.headers['X-CSRFToken'] = token;
    }
    return config;
});

export default axiosInstance;
