import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface userInfo {
  id: string;
  email: string;
  fname: string;
  lname: string;
  phoneNumber: string;
  province: string;
  city: string;
  zipCode: string;
  addName: (name: string) => void;
}
export const useUserInfoStore = create<userInfo>()(
  devtools(set => {
    return {
      userInfo: {
        id: "",
        email: "",
        fname: "",
        lname: "",
        phoneNumber: "",
        province: "",
        city: "",
        zipCode: "",
      },
      addName: name => {
        set(state => {
          return {
            userInfo: {
              ...state.userInfo,
              fname: name,
            },
          };
        });
      },
    };
  }),
);
