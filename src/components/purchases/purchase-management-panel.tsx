"use client";

import { useState } from "react";
import { ArrowDownToLine, PencilLine, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";import { AdminBadge,
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminSelect,
} from "@/components/layout/admin-ui";
import { formatCurrencyINR } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import {
  createPurchase,
  deletePurchase,
  updatePurchase,
} from "@/store/slices/purchase/purchaseThunks";

type PurchaseEntry = {
  id: string;
  vendorCode: string;
  vendorName: string;
  productCode: string;
  productName: string;
  productCategory: string;
  unit: string;
  quantity: number;
  rate: number;
  totalAmount: number;
  paymentStatus: "UNPAID" | "PARTIAL" | "PAID";
  dateLabel: string;
  note: string;
};

type PurchaseManagementPanelProps = {
  entries: PurchaseEntry[];
  vendors: Array<{ code: string; name: string }>;
  products: Array<{ code: string; name: string; category: string }>;
};

export function PurchaseManagementPanel({
  entries,
  vendors,
  products,
}: PurchaseManagementPanelProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    vendorCode: vendors[0]?.code || "",
    productCode: products[0]?.code || "",
    quantity: "0",
    rate: "0",
    paymentStatus: "UNPAID",
    note: "",
    date: "",
  });
  const [error, setError] = useState("");

  function loadEntry(entry: PurchaseEntry) {
    setSelectedId(entry.id);
    setForm({
      vendorCode: entry.vendorCode,
      productCode: entry.productCode,
      quantity: String(entry.quantity),
      rate: String(entry.rate),
      paymentStatus: entry.paymentStatus,
      note: entry.note,
      date: "",
    });
  }

  async function saveEntry() {
    setError("");
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        rate: Number(form.rate),
        paymentStatus: form.paymentStatus as "UNPAID" | "PARTIAL" | "PAID",
      };
      if (selectedId) {
        await dispatch(updatePurchase({ purchaseId: selectedId, data: payload })).unwrap();
      } else {
        await dispatch(createPurchase(payload)).unwrap();
      }
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save purchase");
    }
  }

  async function deleteEntry() {
    if (!selectedId) return;
    setError("");
    try {
      await dispatch(deletePurchase(selectedId)).unwrap();
      setSelectedId(null);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to delete purchase");
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
      <AdminCard>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--admin-text)]">Purchase ledger</h2>
            <p className="mt-1 text-sm text-[var(--admin-muted)]">
              Daily inward milk and add-on purchase entries.
            </p>
          </div>
          <AdminButton
            onClick={() => {
              setSelectedId(null);
              setForm({
                vendorCode: vendors[0]?.code || "",
                productCode: products[0]?.code || "",
                quantity: "0",
                rate: "0",
                paymentStatus: "UNPAID",
                note: "",
                date: "",
              });
            }}
          >
            <Plus className="h-4 w-4" />
            New
          </AdminButton>
        </div>
        <div className="mt-5 space-y-3">
          {entries.map((entry) => (
            <button key={entry.id} type="button" onClick={() => loadEntry(entry)} className="admin-panel-muted w-full rounded-[24px] p-4 text-left">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[var(--admin-text)]">{entry.productName}</p>
                    <AdminBadge tone={entry.paymentStatus === "PAID" ? "success" : "warning"}>
                      {entry.paymentStatus}
                    </AdminBadge>
                  </div>
                  <p className="mt-1 text-sm text-[var(--admin-muted)]">
                    {entry.vendorName} • {entry.dateLabel} • {entry.quantity} {entry.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-[var(--admin-text)]">
                    {formatCurrencyINR(entry.totalAmount)}
                  </p>
                  <PencilLine className="h-4 w-4 text-[var(--admin-muted)]" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--admin-primary-soft)] text-[var(--admin-primary-strong)]">
            <ArrowDownToLine className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--admin-text)]">Purchase CRUD</h2>
            <p className="mt-1 text-sm text-[var(--admin-muted)]">Capture vendor purchase cycle entries.</p>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          <AdminField label="Vendor">
            <AdminSelect value={form.vendorCode} onChange={(event) => setForm((current) => ({ ...current, vendorCode: event.target.value }))}>
              {vendors.map((vendor) => (
                <option key={vendor.code} value={vendor.code}>
                  {vendor.name} • {vendor.code}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Product">
            <AdminSelect value={form.productCode} onChange={(event) => setForm((current) => ({ ...current, productCode: event.target.value }))}>
              {products.map((product) => (
                <option key={product.code} value={product.code}>
                  {product.name} • {product.category}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Quantity">
              <AdminInput value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))} />
            </AdminField>
            <AdminField label="Rate">
              <AdminInput value={form.rate} onChange={(event) => setForm((current) => ({ ...current, rate: event.target.value }))} />
            </AdminField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Payment status">
              <AdminSelect value={form.paymentStatus} onChange={(event) => setForm((current) => ({ ...current, paymentStatus: event.target.value }))}>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
              </AdminSelect>
            </AdminField>
            <AdminField label="Date (optional)">
              <AdminInput value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} placeholder="2026-04-17" />
            </AdminField>
          </div>
          <AdminField label="Note">
            <AdminInput value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} />
          </AdminField>
          {error ? <div className="rounded-[18px] bg-[var(--admin-danger-soft)] px-4 py-3 text-sm font-medium text-[#d14646]">{error}</div> : null}
          <div className="grid gap-2 sm:grid-cols-3">
            <AdminButton className="justify-center" onClick={saveEntry}>Save</AdminButton>
            <AdminButton variant="secondary" className="justify-center" onClick={() => setForm((current) => ({ ...current, quantity: "0", rate: "0", note: "", date: "" }))}>Reset</AdminButton>
            <AdminButton variant="outline" className="justify-center" onClick={deleteEntry} disabled={!selectedId}>
              <Trash2 className="h-4 w-4" />
              Delete
            </AdminButton>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
