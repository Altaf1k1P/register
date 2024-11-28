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
axiosInstance.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  async (error) => {
    // Check if the error is a 401 (Unauthorized) due to expired token
    if (error.response && error.response.status === 401) {
      try {
        // Try to refresh the access token
        const refreshResponse = await axiosInstance.post("/auth/refresh-token");

        // Update accessToken in localStorage and retry the original request
        localStorage.setItem("accessToken", refreshResponse.data.accessToken);
        
        // Retry the original request with the new access token
        const originalRequest = error.config;
        originalRequest.headers["Authorization"] = `Bearer ${refreshResponse.data.accessToken}`;

        // Return the new request with the updated token
        return axiosInstance(originalRequest);
      } catch (err) {
        // If refresh fails, log the user out (clear tokens, redirect to login)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);



export default axiosInstance;
