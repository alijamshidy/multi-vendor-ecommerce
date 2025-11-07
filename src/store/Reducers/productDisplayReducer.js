<<<<<<< HEAD
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/api";

export const get_product_display = createAsyncThunk(
  "product/get_product_display",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/store/${info}/`);
      //console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_featured_product = createAsyncThunk(
  "product/get_featured_product",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.get(info);
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const productDisplayReducer = createSlice({
  name: "products_display",
  initialState: {
    errorMessage: "",
    successMessage: "",
    product_display: [],
    featured_product: "",
    total_items: 0,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(get_product_display.fulfilled, (state, { payload }) => {
        if (payload.featured_product) {
          state.featured_product = payload.featured_product;
        } else {
          state.product_display = payload.results;
          state.total_items = payload.count;
        }
      })
      .addCase(get_featured_product.fulfilled, (state, payload) => {
        state.product_display = payload.payload.results;
        state.total_items = payload.count;
      });
  },
});
export default productDisplayReducer;
=======
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/api";

export const get_product_display = createAsyncThunk(
  "product/get_product_display",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/store/${info}/`);
      //console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_featured_product = createAsyncThunk(
  "product/get_featured_product",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.get(info);
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const productDisplayReducer = createSlice({
  name: "products_display",
  initialState: {
    errorMessage: "",
    successMessage: "",
    product_display: [],
    featured_product: "",
    total_items: 0,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(get_product_display.fulfilled, (state, { payload }) => {
        if (payload.featured_product) {
          state.featured_product = payload.featured_product;
        } else {
          state.product_display = payload.results;
          state.total_items = payload.count;
        }
      })
      .addCase(get_featured_product.fulfilled, (state, payload) => {
        state.product_display = payload.payload.results;
        state.total_items = payload.count;
      });
  },
});
export default productDisplayReducer;
>>>>>>> 86be6a8 (.)
