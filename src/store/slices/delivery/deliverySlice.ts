import { createSlice } from "@reduxjs/toolkit";
import { resetDelivery, saveDelivery } from "./deliveryThunks";
import type { DeliveryRecord } from "./DeliveryType";

type DeliveriesState = {
  listDelivery: DeliveryRecord[];
  loading: boolean;
  error: string | null;
};

const initialState: DeliveriesState = {
  listDelivery: [],
  loading: false,
  error: null,
};

const deliverySlice = createSlice({
  name: "deliveries",
  initialState,
  reducers: {
    clearDeliveryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDelivery.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.listDelivery.findIndex(
          (d) => d._id === action.payload._id,
        );
        if (idx !== -1) {
          state.listDelivery[idx] = action.payload;
        } else {
          state.listDelivery.push(action.payload);
        }
      })
      .addCase(saveDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(resetDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.listDelivery = state.listDelivery.filter(
          (d) => String(d.customerId) !== String(action.payload.customerCode),
        );
      });
  },
});

export const { clearDeliveryError } = deliverySlice.actions;
export default deliverySlice.reducer;
