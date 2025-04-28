import axios from "axios";

// export const apiBaseUrl = "http://localhost:8001/api"; // Local API URL
export const apiBaseUrl = "https://www.hlsnigeria.com.ng/api"; // Live API URL

// Function to determine content type
export const getContentType = (type?: string) => {
    return type ? { "Content-Type": type } : { "Content-Type": "application/json" };
};

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: getContentType(),
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized! Redirecting to login...");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Utility functions for API calls
export const api = {
    get: (url: string, params?: object, headers?: object) =>
        axiosInstance.get(url, { params, headers }),

    post: (url: string, data?: object, headers?: object) =>
        axiosInstance.post(url, data, {
            headers: {
                ...(data instanceof FormData ? getContentType("multipart/form-data") : getContentType()),
                ...headers,
            },
        }),

    put: (url: string, data?: object, headers?: object) =>
        axiosInstance.put(url, data, {
            headers: {
                ...(data instanceof FormData ? getContentType("multipart/form-data") : getContentType()),
                ...headers,
            },
        }),

    delete: (url: string, headers?: object) =>
        axiosInstance.delete(url, { headers }),
};

export default axiosInstance;
