import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// =========================
// ✅ REQUEST INTERCEPTOR
// =========================
Api.interceptors.request.use(
  (config) => {
    const stored = sessionStorage.getItem("quickmeds_vendor_token");
    const token  = stored ? JSON.parse(stored)?.token : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// ✅ RESPONSE INTERCEPTOR
// =========================
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("quickmeds_vendor_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default Api;