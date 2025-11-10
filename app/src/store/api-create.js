import axios from 'axios';
import router from "@/router/router.js";

function ApiCreate(url, tokenKey) {
    const api = axios.create({
        baseURL: url,
    });

    api.interceptors.request.use(async (config) => {
        const token = localStorage.getItem(tokenKey);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem(tokenKey);
                router.push('/login');
            }
            return Promise.reject(error);
        }
    );

    return api;
}

export default ApiCreate;