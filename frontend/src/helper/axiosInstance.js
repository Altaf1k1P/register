import axios from "axios";
import { BASE_URL } from "../constant.js";

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Set baseURL directly
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include credentials for cross-origin requests
});

// Request Interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage and add it to the request headers
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // If an error occurs during request setup, log it
    return Promise.reject(error);
  }
);

export default axiosInstance;
