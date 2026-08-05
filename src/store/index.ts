import { configureStore } from "@reduxjs/toolkit";
import areaReducer from "./slices/areaSlice/areaSlice";
import vendorReducer from "./slices/vendor/vendorSlice";
import productReducer from "./slices/product/productSlice";
import authReducer from "./slices/auth/authSlice";
import customerReducer from "./slices/customerSlice/customerSlice";
import deliveryReducer from "./slices/delivery/deliverySlice";
import paymentReducer from "./slices/payment/paymentSlice";
import purchaseReducer from "./slices/purchase/purchaseSlice";
import milkEntryReducer from "./slices/milkEntry/milkEntrySlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      areas: areaReducer,
      vendors: vendorReducer,
      products: productReducer,
      auth: authReducer,
      customers: customerReducer,
      deliveries: deliveryReducer,
      payments: paymentReducer,
      purchases: purchaseReducer,
      milkEntries: milkEntryReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
