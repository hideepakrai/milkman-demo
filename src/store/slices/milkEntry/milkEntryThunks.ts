import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CreateMilkEntryPayload, MilkLedgerFilters, MilkLedgerResult } from "./MilkEntryType";

export const fetchMilkLedger = createAsyncThunk(
  "milkEntries/fetchMilkLedger",
  async (filters: MilkLedgerFilters = {}) => {
    const searchParams = new URLSearchParams();
    if (filters.vendorCode) searchParams.set("vendorCode", filters.vendorCode);
    if (filters.dateFrom) searchParams.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) searchParams.set("dateTo", filters.dateTo);
    const res = await fetch(`/api/milk-entries?${searchParams.toString()}`);
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Unable to load ledger");
    }
    const data = await res.json();
    return data as MilkLedgerResult;
  },
);

export const createMilkEntry = createAsyncThunk(
  "milkEntries/createMilkEntry",
  async (payload: CreateMilkEntryPayload) => {
    const res = await fetch("/api/milk-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Unable to save milk entry");
    }
    const data = await res.json();
    return data.entry as MilkLedgerResult["entries"][number];
  },
);
