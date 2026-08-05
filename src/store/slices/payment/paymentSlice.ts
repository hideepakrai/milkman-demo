import { createSlice } from "@reduxjs/toolkit";
import { createPayment, fetchPayments } from "./paymentThunks";
import type { PaymentRecord } from "./PaymentType";

type PaymentsState = {
  listPayment: PaymentRecord[];
  loading: boolean;
  error: string | null;
  isFetchedPayment: boolean;
};

const initialState: PaymentsState = {
  listPayment: [],
  loading: false,
  error: null,
  isFetchedPayment: false,
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearPaymentError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.listPayment = action.payload;
        state.isFetchedPayment = true;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.listPayment.unshift(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
