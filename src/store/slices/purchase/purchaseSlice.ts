import { createSlice } from "@reduxjs/toolkit";
import { createPurchase, deletePurchase, fetchPurchases, updatePurchase } from "./purchaseThunks";
import type { PurchaseRecord } from "./PurchaseType";

type PurchasesState = {
  listPurchase: PurchaseRecord[];
  loading: boolean;
  error: string | null;
  isFetchedPurchase: boolean;
};

const initialState: PurchasesState = {
  listPurchase: [],
  loading: false,
  error: null,
  isFetchedPurchase: false,
};

const purchaseSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    clearPurchaseError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.listPurchase = action.payload;
        state.isFetchedPurchase = true;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.listPurchase.unshift(action.payload);
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        const idx = state.listPurchase.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) {
          state.listPurchase[idx] = action.payload;
        }
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.listPurchase = state.listPurchase.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearPurchaseError } = purchaseSlice.actions;
export default purchaseSlice.reducer;
