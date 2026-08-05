export type MilkEntryRecord = {
  id: string;
  vendorCode: string;
  vendorName: string;
  date: string;
  dateLabel: string;
  quantity: number;
  rate: number;
  total: number;
  status: "PAID" | "UNPAID";
};

export type MilkLedgerSummary = {
  totalMilk: number;
  totalAmount: number;
  totalUnpaid: number;
};

export type MilkLedgerResult = {
  entries: MilkEntryRecord[];
  summary: MilkLedgerSummary;
};

export type MilkLedgerFilters = {
  vendorCode?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type CreateMilkEntryPayload = {
  vendorCode: string;
  date: string;
  quantity: number;
  rate: number;
  status?: "PAID" | "UNPAID";
};
