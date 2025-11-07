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
