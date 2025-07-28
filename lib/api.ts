import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";

const BASE_URL = isProduction
  ? "https://offloadbackend.onrender.com/api"
  : "https://offloadbackend.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 50000, // 50 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token"); // or read from cookies
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – redirecting to login");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
