import axios from "axios";
import { BASE_URL } from "../constant";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // To include cookies in requests
});

// Request Interceptor: Add Authorization Header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`; // Add the token to the header
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry
axiosInstance.interceptors.response.use(
    (response) => response, // Return the response if no error
    async (error) => {
        const originalRequest = error.config;

        // If token has expired (401), try refreshing it
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axiosInstance.post("/auth/refresh-token");
                const newAccessToken = refreshResponse.data.accessToken;

                // Update localStorage with new token
                localStorage.setItem("accessToken", newAccessToken);

                // Retry the original request with the new token
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Redirect to login on failure to refresh token
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
