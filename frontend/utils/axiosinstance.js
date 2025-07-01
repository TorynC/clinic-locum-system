import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://24.199.118.55:5000/api",
    timeout: 30000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;
