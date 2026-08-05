import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CreatePaymentPayload, PaymentRecord } from "./PaymentType";

export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async (options?: { limit?: number }) => {
    const params = options?.limit ? `?limit=${options.limit}` : "";
    const res = await fetch(`/api/payments${params}`);
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to fetch payments");
    }
    const data = await res.json();
    return data.payments as PaymentRecord[];
  },
);

export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (payload: CreatePaymentPayload) => {
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to save payment");
    }
    const data = await res.json();
    return data.payment as PaymentRecord;
  },
);
