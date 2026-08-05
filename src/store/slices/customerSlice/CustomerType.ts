export interface CreateCustomerPayload {
  name: string;
  phone: string;
  preferredLanguage?: "en" | "hi" | "pa";
  addressLine1: string;
  addressLine2?: string;
  areaCode: string;
  landmark?: string;
  notes?: string;
  deliveryInstruction?: string;
  quantityLiters: number;
  pricePerLiter: number;
  unitLabel?: string;
  status?: "ACTIVE" | "PAUSED" | "INACTIVE";
};


export type CustomerRecord = {
  _id: string;
  customerCode: string;
  name: string;
  phone: string;
  address: string;
  areaCode: string;
  status: "ACTIVE" | "PAUSED" | "INACTIVE";
  areaName: string;
  quantityLabel: string;
  quantity: number;
  rate: number;
  due: number;
  advance: number;
  billed: number;
  paid: number;
  notes?: string;
  deliveryInstruction?: string;
  deliverySlot?: string;
  deliveryStatus?: string | null;
  extraQuantity?: number;
  preferredLanguage?: "en" | "hi" | "pa";
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
};