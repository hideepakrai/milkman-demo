import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CreatePurchasePayload, PurchaseRecord, UpdatePurchasePayload } from "./PurchaseType";

export const fetchPurchases = createAsyncThunk("purchases/fetchPurchases", async () => {
  const res = await fetch("/api/purchases");
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error ?? "Failed to fetch purchases");
  }
  const data = await res.json();
  return data.purchases as PurchaseRecord[];
});

export const createPurchase = createAsyncThunk(
  "purchases/createPurchase",
  async (payload: CreatePurchasePayload) => {
    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to create purchase entry");
    }
    const data = await res.json();
    return data.purchase as PurchaseRecord;
  },
);

export const updatePurchase = createAsyncThunk(
  "purchases/updatePurchase",
  async ({ purchaseId, data }: UpdatePurchasePayload) => {
    const res = await fetch(`/api/purchases/${purchaseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to update purchase entry");
    }
    const body = await res.json();
    return body.purchase as PurchaseRecord;
  },
);

export const deletePurchase = createAsyncThunk(
  "purchases/deletePurchase",
  async (purchaseId: string) => {
    const res = await fetch(`/api/purchases/${purchaseId}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to delete purchase entry");
    }
    return purchaseId;
  },
);
