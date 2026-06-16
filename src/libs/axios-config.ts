import axios from "axios";

export const baseApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor: attach Bearer token
baseApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle 401 → auto logout
baseApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("auth_user");
            // Redirect to login if not already there
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    },
);
