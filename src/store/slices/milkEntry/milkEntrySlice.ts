import { createSlice } from "@reduxjs/toolkit";
import { createMilkEntry, fetchMilkLedger } from "./milkEntryThunks";
import type { MilkEntryRecord, MilkLedgerSummary } from "./MilkEntryType";

type MilkEntriesState = {
  ledgerEntries: MilkEntryRecord[];
  ledgerSummary: MilkLedgerSummary;
  loading: boolean;
  error: string | null;
};

const initialState: MilkEntriesState = {
  ledgerEntries: [],
  ledgerSummary: {
    totalMilk: 0,
    totalAmount: 0,
    totalUnpaid: 0,
  },
  loading: false,
  error: null,
};

const milkEntrySlice = createSlice({
  name: "milkEntries",
  initialState,
  reducers: {
    clearMilkEntryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMilkLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilkLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.ledgerEntries = action.payload.entries;
        state.ledgerSummary = action.payload.summary;
      })
      .addCase(fetchMilkLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(createMilkEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMilkEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.ledgerEntries.unshift(action.payload);
        state.ledgerSummary.totalMilk += action.payload.quantity;
        state.ledgerSummary.totalAmount += action.payload.total;
        if (action.payload.status === "UNPAID") {
          state.ledgerSummary.totalUnpaid += action.payload.total;
        }
      })
      .addCase(createMilkEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const { clearMilkEntryError } = milkEntrySlice.actions;
export default milkEntrySlice.reducer;
