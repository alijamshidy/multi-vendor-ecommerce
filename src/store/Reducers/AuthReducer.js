<<<<<<< HEAD
/* eslint-disable react-hooks/rules-of-hooks */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
let token = localStorage.getItem("access");

export const send_otp_code = createAsyncThunk(
  "auth/send_otp_code",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/auth/send/", info);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// end Method
export const verify_otp_code = createAsyncThunk(
  "auth/verify_otp_code",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/auth/verify/", info);
      localStorage.setItem("access", data.access);

      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// end Method
export const login = createAsyncThunk(
  "auth/login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("", info);
      localStorage.setItem("customerToken", data.access);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// end Method

export const get_customer = createAsyncThunk(
  "auth/get_customer",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      token = localStorage.getItem("access");

      if (token) {
        const { data } = await api.get("/store/customer/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return fulfillWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// end Method

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    loader: false,
    userInfo: [],
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: builder => {
    builder
      .addCase(get_customer.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(get_customer.rejected, (state, { payload }) => {
        localStorage.removeItem("access");
        state.loader = false;
      })
      .addCase(get_customer.fulfilled, (state, { payload }) => {
        if (payload) {
          state.userInfo = payload[0];
        }
        state.loader = false;
      })
      .addCase(send_otp_code.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(send_otp_code.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(send_otp_code.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
      })
      .addCase(verify_otp_code.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(verify_otp_code.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(verify_otp_code.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
        get_customer();
      })
      .addCase(login.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
        get_customer();
      });
  },
});
export const { messageClear } = authReducer.actions;
export default authReducer;
=======
/* eslint-disable react-hooks/rules-of-hooks */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const send_otp_code = createAsyncThunk(
  "auth/send_otp_code",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/auth/send/", info);

      return fulfillWithValue(data);
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        return rejectWithValue("تعداد درخواست های شما بیش از حد مجاز است لطفا بعدا تلاش کنید");
      }
      return rejectWithValue(error.response.data.detail);
    }
  }
);
// end Method
export const verify_otp_code = createAsyncThunk(
  "auth/verify_otp_code",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const date = new Date().getDay();
      console.log(date);
      const { data } = await api.post("/auth/verify/", info);
      localStorage.setItem("customerToken", data?.data?.access);
      localStorage.setItem("userInfo", JSON.stringify(data?.data?.user));
      console.log(data)

      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
// end Method
export const login = createAsyncThunk(
  "auth/login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(info)
      const { data } = await api.post("/auth/login", info);
      localStorage.setItem("customerToken", data.access);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// end Method

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    localStorage.removeItem('customerToken')
    localStorage.removeItem('userInfo')
    return fulfillWithValue();
  })


// export const get_customer = createAsyncThunk(
//   "auth/get_customer",
//   async (customerToken, { fulfillWithValue, rejectWithValue }) => {
//     try {

//       console.log(customerToken)
//         const { data } = await api.get("/store/customer/", {
//           headers: {
//             Authorization: `Bearer ${customerToken}`,
//           },
//         });
//         console.log(data);

//         return fulfillWithValue(data);
      
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );
// end Method

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    loader: false,
    userInfo: JSON.parse(localStorage.getItem('userInfo'))||[],
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: builder => {
    builder
      // .addCase(get_customer.pending, (state, { payload }) => {
      //   state.loader = true;
      // })
      // .addCase(get_customer.rejected, (state, { payload }) => {
      //   localStorage.removeItem("access");
      //   state.loader = false;
      // })
      // .addCase(get_customer.fulfilled, (state, { payload }) => {
        
      //     state.userInfo = payload;
        
      //   state.loader = false;
      // })
      .addCase(logout.fulfilled,(state,_)=>{
        state.userInfo = {};
        state.successMessage="خروج با موفقیت انجام شد"
      })
      .addCase(send_otp_code.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(send_otp_code.rejected, (state, { payload }) => {
        state.errorMessage = payload;
        state.loader = false;
      })
      .addCase(send_otp_code.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
      })
      .addCase(verify_otp_code.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(verify_otp_code.rejected, (state, { payload }) => {
        state.errorMessage = payload.detail;
        state.loader = false;
      })
      .addCase(verify_otp_code.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.userInfo = payload.data.user;
        state.loader = false;

      })
      .addCase(login.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;

      });
  },
});
export const { messageClear } = authReducer.actions;
export default authReducer;
>>>>>>> 86be6a8 (.)
