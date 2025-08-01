import authReducer from "./Reducers/AuthReducer";
import cardReducer from "./Reducers/cardReducer";
import homeReducer from "./Reducers/homeReducer";
import productDisplayReducer from "./Reducers/productDisplayReducer";

const rootReducer = {
  auth: authReducer.reducer,
  home: homeReducer.reducer,
  card: cardReducer.reducer,
  productDisplay: productDisplayReducer.reducer,
};
export default rootReducer;
