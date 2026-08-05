export type PurchasePaymentStatus = "UNPAID" | "PARTIAL" | "PAID";

export type PurchaseRecord = {
  _id: string;
  vendorId?: string;
  vendorCode: string;
  vendorName: string;
  productId?: string;
  productCode: string;
  productName: string;
  productCategory: "MILK" | "DAIRY_ADDON" | "OTHER";
  unit: string;
  quantity: number;
  rate: number;
  totalAmount: number;
  date: string | Date;
  paymentStatus: PurchasePaymentStatus;
  note?: string;
};

export type CreatePurchasePayload = {
  vendorCode: string;
  productCode: string;
  quantity: number;
  rate: number;
  paymentStatus?: PurchasePaymentStatus;
  note?: string;
  date?: string;
};

export type UpdatePurchasePayload = {
  purchaseId: string;
  data: CreatePurchasePayload;
};
