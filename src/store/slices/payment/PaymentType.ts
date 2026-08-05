export type PaymentMode = "CASH" | "UPI" | "BANK";

export type PaymentRecord = {
  _id: string;
  customerId: string;
  customerCode?: string;
  amount: number;
  date: string | Date;
  mode: PaymentMode;
  note?: string;
};

export type CreatePaymentPayload = {
  customerCode: string;
  amount: number;
  mode: PaymentMode;
  note?: string;
  date?: string;
};
