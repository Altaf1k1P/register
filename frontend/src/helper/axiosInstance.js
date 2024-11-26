import axios from "axios";
import { BASE_URL } from "../constant.js";

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Set baseURL directly
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include credentials for cross-origin requests
});

export default axiosInstance;
