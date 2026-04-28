import { create } from "zustand";

interface HomeState {
  userInfo: any;
  setUserInfo: (userInfo: any) => void;
}
export const homeStore = create<HomeState>(set => ({
  userInfo: {
    name: "",
    userId: "",
    avatar: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    createdAt: "",
    updatedAt: "",
  },
  setUserInfo: userInfo => set(() => ({ userInfo: userInfo })),
}));
