export type DeliveryStatus = "DELIVERED" | "SKIPPED" | "PAUSED";

export type DeliveryRecord = {
  _id: string;
  customerId: string;
  date: string | Date;
  defaultQuantity: number;
  actualQuantity: number;
  extraQuantity?: number;
  pricePerLiter?: number;
  status: DeliveryStatus;
  note?: string;
};

export type SaveDeliveryPayload = {
  customerCode: string;
  status: DeliveryStatus;
  actualQuantity?: number;
  note?: string;
  date?: string;
};

export type ResetDeliveryPayload = {
  customerCode: string;
  date?: string;
};
