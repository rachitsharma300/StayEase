// ✅ src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Add token before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token added:", token.substring(0, 25) + "...");
    } else {
      console.warn("⚠️ No token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚫 Handle 403 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("❌ 403 Forbidden — invalid or missing token");
      // Optional redirect to login:
      // window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
