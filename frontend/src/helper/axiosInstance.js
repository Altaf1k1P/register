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
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Prevent infinite retries
          try {
              const refreshResponse = await axiosInstance.post("/auth/refresh-token");
              const newAccessToken = refreshResponse.data.accessToken;

              // Update localStorage
              localStorage.setItem("accessToken", newAccessToken);

              // Retry original request
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axiosInstance(originalRequest);
          } catch (refreshError) {
              // Redirect to login on failure
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              window.location.href = "/login";
              return Promise.reject(refreshError);
          }
      }

      return Promise.reject(error);
  }
);


export default axiosInstance;
