import { apiFetch } from "./client";
import { Purchase, ApiResponse } from "./types";

export async function getPurchases(params?: { search?: string; page?: number; limit?: number }): Promise<Purchase[]> {
  const res = await apiFetch<Purchase[]>("/purchase", { params });
  return (res.result || res.data || []) as Purchase[];
}

export async function getPurchase(id: number | string): Promise<Purchase | null> {
  const res = await apiFetch<Purchase>(`/purchase/${id}`);
  return res.result || null;
}

export async function createPurchase(payload: {
  supplier_id: number;
  invoice_number: string;
  purchase_date?: string;
  total_cost: number;
  paid_amount?: number;
  purchase_status?: "received" | "ordered" | "pending" | "cancel";
  items: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
    total_price?: number;
  }>;
}): Promise<ApiResponse<Purchase>> {
  return await apiFetch<Purchase>("/purchase", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePurchaseStatus(
  id: number | string,
  purchaseStatus: "received" | "ordered" | "pending" | "cancel"
): Promise<ApiResponse<Purchase>> {
  return await apiFetch<Purchase>(`/purchase/${id}`, {
    method: "PUT",
    body: JSON.stringify({ purchaseStatus }),
  });
}

export async function addPurchasePayment(id: number | string, paidAmount: number): Promise<ApiResponse<Purchase>> {
  return await apiFetch<Purchase>(`/purchase/addPayment/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ paidAmount }),
  });
}
