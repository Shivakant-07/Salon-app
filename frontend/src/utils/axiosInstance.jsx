// frontend/src/utils/axiosInstance.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://salon-backend-ktdp.onrender.com/api",
    withCredentials: true, // keep this if you want to send cookies too
});

// attach Authorization header from localStorage if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
