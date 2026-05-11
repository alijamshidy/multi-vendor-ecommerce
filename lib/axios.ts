// lib/axios.ts
import axios from "axios";

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor برای درخواست‌ها
Axios.interceptors.request.use(
  config => {
    // اضافه کردن token به هدرها
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Interceptor برای پاسخ‌ها
Axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // مدیریت خطای احراز هویت
      // redirect to login
    }
    return Promise.reject(error);
  },
);

export default Axios;
