import axios from "axios";

export const apiBaseUrl = "https://www.hls.com.ng/api";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage or another secure storage
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration or unauthorized errors
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // Optionally, handle logout or redirection
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
    axiosInstance.post(url, data, { headers }),

  put: (url: string, data?: object, headers?: object) =>
    axiosInstance.put(url, data, { headers }),

  delete: (url: string, headers?: object) =>
    axiosInstance.delete(url, { headers }),
};

export default axiosInstance;
