// src/services/apiClient.js

import axios from 'axios';
import { getCsrfToken, fetchCsrfToken } from '../utils/csrf';
import apiConfig from '../config/api';

const axiosInstance = axios.create({
    baseURL: apiConfig.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
    if (!config.headers['X-CSRFToken']) {
        let token = getCsrfToken();
        if (!token) {
            token = await fetchCsrfToken();
        }
        if (token) {
            config.headers['X-CSRFToken'] = token;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response && error.response.status === 403 && error.response.data.detail === 'CSRF Failed') {
            const newToken = await fetchCsrfToken();
            if (newToken) {
                error.config.headers['X-CSRFToken'] = newToken;
                return axiosInstance(error.config);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;