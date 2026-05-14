// import { create } from "zustand";
// import { devtools } from "zustand/middleware";

// interface userInfo {
//   id: string;
//   email: string;
//   fname: string;
//   lname: string;
//   phoneNumber: string;
//   image: string;
//   province: string;
//   city: string;
//   zipCode: string;
//   addName: (name: string) => void;
// }
// export const useUserInfoStore = create<userInfo>()(
//   devtools(set => {
//     return {
//       userInfo: {
//         id: "",
//         email: "",
//         fname: "",
//         lname: "",
//         phoneNumber: "",
//         image: "",
//         province: "",
//         city: "",
//         zipCode: "",
//       },
//       addName: name => {
//         set(state => {
//           return {
//             userInfo: {
//               ...state.userInfo,
//               fname: name,
//             },
//           };
//         });
//       },
//     };
//   }),
// );

import Axios from "@/lib/axios";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const getRoleFromToken = token => {
  if (!token) return "";
  try {
    const decoded = jwtDecode(token);
    const expireTime = new Date(decoded.exp * 1000);
    if (new Date() > expireTime) return "";
    return decoded.role;
  } catch {
    return "";
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      successMessage: "",
      errorMessage: "",
      loader: false,
      userInfo: null,
      token: null,
      role: "",

      clearMessage: () => set({ errorMessage: "", successMessage: "" }),

      admin_login: async info => {
        set({ loader: true, errorMessage: "", successMessage: "" });
        try {
          const { data } = await Axios.post("/admin-login", info, {
            withCredentials: true,
          });
          localStorage.setItem("accessToken", data.token);
          set({
            loader: false,
            successMessage: data.message,
            token: data.token,
            role: getRoleFromToken(data.token),
          });
          return data;
        } catch (error) {
          set({
            loader: false,
            errorMessage: error.response?.data?.error || "Login failed",
          });
          throw error;
        }
      },

      seller_login: async info => {
        set({ loader: true, errorMessage: "", successMessage: "" });
        try {
          const { data } = await axios.post(
            "http://localhost:5000/api/seller-login",
            info,
            {
              withCredentials: true,
            },
          );
          localStorage.setItem("accessToken", data.token);
          set({
            loader: false,
            successMessage: data.message,
            token: data.token,
            role: getRoleFromToken(data.token),
          });
          return data;
        } catch (error) {
          set({
            loader: false,
            errorMessage: error.response?.data?.error || "Login failed",
          });
          throw error;
        }
      },

      seller_register: async info => {
        set({ loader: true, errorMessage: "", successMessage: "" });
        try {
          const { data } = await Axios.post("/seller-register", info, {
            withCredentials: true,
          });
          localStorage.setItem("accessToken", data.token);
          set({
            loader: false,
            successMessage: data.message,
            token: data.token,
            role: getRoleFromToken(data.token),
          });
          return data;
        } catch (error) {
          set({
            loader: false,
            errorMessage: error.response?.data?.error || "Registration failed",
          });
          throw error;
        }
      },

      get_user_info: async () => {
        set({ loader: true });
        try {
          const { data } = await Axios.get("/get-user", {
            withCredentials: true,
          });
          set({ loader: false, userInfo: data.userInfo });
          return data;
        } catch (error) {
          set({
            loader: false,
            errorMessage: error.response?.data?.error || "Failed to fetch user",
          });
          throw error;
        }
      },

      profile_image_upload: async imageData => {
        set({ loader: true, errorMessage: "", successMessage: "" });
        try {
          const { data } = await Axios.post(
            "/profile-image-upload",
            imageData,
            { withCredentials: true },
          );
          set({
            loader: false,
            userInfo: data.userInfo,
            successMessage: data.message,
          });
          return data;
        } catch (error) {
          set({
            loader: false,
            errorMessage: error.response?.data?.error || "Image upload failed",
          });
          throw error;
        }
      },

      profile_info_add: async info => {
        set({ loader: true, errorMessage: "", successMessage: "" });
        try {
          const { data } = await Axios.post("/profile-info-add", info, {
            withCredentials: true,
          });
          set({
            loader: false,
            userInfo: data.userInfo,
            successMessage: data.message,
          });
          return data;
        } catch (error) {
          set({
            loader: false,
            errorMessage:
              error.response?.data?.error || "Profile update failed",
          });
          throw error;
        }
      },

      change_password: async info => {
        set({ loader: true, errorMessage: "", successMessage: "" });
        try {
          const { data } = await Axios.post("/change-password", info, {
            withCredentials: true,
          });
          set({ loader: false, successMessage: data.message });
          return data;
        } catch (error) {
          set({
            loader: false,
            errorMessage:
              error.response?.data?.message || "Password change failed",
          });
          throw error;
        }
      },

      logout: async (navigate, role) => {
        try {
          await api.get("/logout", { withCredentials: true });
        } catch (error) {
          // ignore server error, still clear local state
        }
        localStorage.removeItem("accessToken");
        set({
          token: null,
          role: "",
          userInfo: null,
          successMessage: "",
          errorMessage: "",
        });
        // Navigate using Next.js router (must be called from component)
        if (role === "admin") {
          navigate("/admin/login");
        } else {
          navigate("/login");
        }
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      partialize: state => ({
        // only persist token and role
        token: state.token,
        role: state.role,
      }),
      onRehydrateStorage: () => state => {
        // After rehydration, sync role from token if needed
        if (state?.token) {
          const derivedRole = getRoleFromToken(state.token);
          if (derivedRole !== state.role) {
            state.role = derivedRole;
          }
        }
      },
    },
  ),
);

export default useAuthStore;
