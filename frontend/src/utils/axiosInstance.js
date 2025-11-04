import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://leave-management-ncp0.onrender.com/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
