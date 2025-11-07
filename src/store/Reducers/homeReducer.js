import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

let token = localStorage.getItem("access");
export const get_category = createAsyncThunk(
  "product/get_category",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/store/categories/");
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const get_collection = createAsyncThunk(
  "home/get_collection",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/store/collections/");
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//end Method
export const get_products = createAsyncThunk(
  "product/get_products",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/store/products");
      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
//end Method
export const price_range_product = createAsyncThunk(
  "product/price_range_product",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/home/price-range-latest-product");
      //console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const query_products = createAsyncThunk(
  "product/query_products",
  async (query, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/home/query-products?category=${query.category}&&rating=${
          query.rating
        }&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${
          query.sortPrice
        }&&pageNumber=${query.pageNumber}&&searchValue=${
          query.searchValue ? query.searchValue : ""
        }`
      );

      //console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const product_details = createAsyncThunk(
  "product/product_details",
  async (slug, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/store/products/${slug}`);
      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const customer_review = createAsyncThunk(
  "review/customer_review",
  async ({ info, slug }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `/store/products/${slug}/reviews/`,
        info,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data.non_field_errors[0]);
    }
  }
);
//end Method
export const customer_rating = createAsyncThunk(
  "review/customer_rating",
  async ({ info, slug }, { fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/store/products/${slug}/ratings`, info);
      //console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const update_rating = createAsyncThunk(
  "review/update_rating",
  async ({ info, slug, id }, { fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/store/products/${slug}/ratings/${id}/`,
        info,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const get_reviews = createAsyncThunk(
  "review/get_reviews",
  async ({ product_slug, page }, { fulfillWithValue }) => {
    try {
      let { data } = {};
      if (page) {
        data = await api.get(
          `/store/products/${product_slug}/reviews/?page=${page}`
        );
      } else {
        data = await api.get(`/store/products/${product_slug}/reviews/`);
      }
      //console.log(data.data);
      return fulfillWithValue(data.data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const get_ratings = createAsyncThunk(
  "review/get_ratings",
  async ({ product_slug }, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/store/products/${product_slug}/ratings/`
      );
      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const get_my_rating = createAsyncThunk(
  "review/get_my_rating",
  async ({ product_slug }, { fulfillWithValue }) => {
    token = localStorage.getItem("access");
    console.log(token);

    try {
      const { data } = await api.get(
        `/store/products/${product_slug}/ratings/me/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error);
    }
  }
);
//end Method
export const delete_review = createAsyncThunk(
  "review/delete_review",
  async ({ info }, { fulfillWithValue }) => {
    try {
      const data = await api.delete(
        `/store/products/${info.slug}/reviews/${info.reId}/`
      );
      console.log(data.status);
      return fulfillWithValue(data.status);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const add_react = createAsyncThunk(
  "review/add_react",
  async ({ info, react }, { fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/store/products/${info.product_slug}/reviews/${info.reviewId}/reactions/`,
        react,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const add_replay = createAsyncThunk(
  "review/add_replay",
  async ({ info, react }, { fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/store/products/${info.product_slug}/reviews/${info.reviewId}/reactions/`,
        react,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
//end Method
export const change_react = createAsyncThunk(
  "review/change_react",
  async ({ info, react }, { fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/store/products/${info.product_slug}/reviews/${info.reviewId}/reactions/${info.reactionId}/`,
        react,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error);
    }
  }
);
//end Method

export const homeReducer = createSlice({
  name: "home",
  initialState: {
    errorMessage: "",
    successMessage: "",
    totalReview: 0,
    totalRating: 0,
    ratings: [],
    rating: 0,
    reviews: [],
    categorys: [],
    collections: [],
    products: [],
    totalProduct: [],
    myRating: [],
    parPage: 3,
    latest_product: [],
    topRated_product: [],
    discount_product: [],
    priceRange: {
      low: 0,
      high: 100,
    },
    product: {},
    relatedProducts: [],
    moreProducts: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: builder => {
    builder
      .addCase(get_category.fulfilled, (state, { payload }) => {
        state.categorys = payload.results;
      })
      .addCase(get_collection.fulfilled, (state, { payload }) => {
        state.collections = payload.results;
      })
      .addCase(get_products.fulfilled, (state, { payload }) => {
        state.products = payload;
        // state.latest_product = payload.latest_product;
        // state.topRated_product = payload.topRated_product;
        // state.discount_product = payload.discount_product;
      })
      .addCase(price_range_product.fulfilled, (state, { payload }) => {
        state.latest_product = payload.latest_product;
        state.priceRange = payload.priceRange;
      })
      .addCase(query_products.fulfilled, (state, { payload }) => {
        state.products = payload.products;
        state.totalProduct = payload.totalproduct;
        state.parPage = payload.parPage;
      })
      .addCase(product_details.fulfilled, (state, { payload }) => {
        state.product = payload;
      })
      .addCase(customer_review.rejected, (state, { payload }) => {
        state.errorMessage = " ! شما قبلا به این محصول نظر داده اید ";
      })
      .addCase(customer_review.fulfilled, (state, { payload }) => {
        state.successMessage = "! نظر شما با موفقیت ثبت شد";
      })
      .addCase(customer_rating.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(get_reviews.fulfilled, (state, { payload }) => {
        state.reviews = payload.results;
        state.totalReview = payload.count;
      })
      .addCase(get_ratings.fulfilled, (state, { payload }) => {
        state.ratings = payload;
        state.totalRating = state.ratings?.length;
        let rating = 0;
        state.ratings?.forEach(rat => {
          rating += rat.rating;
        });
        state.rating = rating / state.totalRating;
      })
      .addCase(get_my_rating.fulfilled, (state, { payload }) => {
        state.myRating = payload;
      })
      .addCase(update_rating.fulfilled, (state, { payload }) => {
        state.successMessage = "! امتیاز دهی شما تغییر کرد";
      })
      .addCase(add_react.fulfilled, (state, { payload }) => {
        state.successMessage = "!  نظر شما ثبت شد";
      })
      .addCase(change_react.fulfilled, (state, { payload }) => {
        state.successMessage = "!  نظر شما تغییر کرد";
      })
      .addCase(delete_review.fulfilled, (state, { payload }) => {
        if (payload === 204) {
          state.successMessage = "!  نظر شما با موفقیت حذف شد";
        }
      });
  },
});
export const { messageClear } = homeReducer.actions;
export default homeReducer;
