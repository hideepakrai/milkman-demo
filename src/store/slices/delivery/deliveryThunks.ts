import { createAsyncThunk } from "@reduxjs/toolkit";
import type { DeliveryRecord, ResetDeliveryPayload, SaveDeliveryPayload } from "./DeliveryType";

export const saveDelivery = createAsyncThunk(
  "deliveries/saveDelivery",
  async (payload: SaveDeliveryPayload) => {
    const res = await fetch("/api/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to save delivery");
    }
    const data = await res.json();
    return data.delivery as DeliveryRecord;
  },
);

export const resetDelivery = createAsyncThunk(
  "deliveries/resetDelivery",
  async (payload: ResetDeliveryPayload) => {
    const params = new URLSearchParams({ customerCode: payload.customerCode });
    if (payload.date) params.set("date", payload.date);
    const res = await fetch(`/api/deliveries?${params.toString()}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to reset delivery");
    }
    return payload;
  },
);
