import { apiFetch } from "./client";
import { Sale, ApiResponse } from "./types";

export async function getSales(params?: { search?: string; page?: number; limit?: number }): Promise<Sale[]> {
  const res = await apiFetch<Sale[]>("/sale", { params });
  return (res.result || res.data || []) as Sale[];
}

export async function getSale(id: number | string): Promise<Sale | null> {
  const res = await apiFetch<Sale>(`/sale/find/${id}`);
  return res.result || null;
}

export async function createSale(payload: {
  customer_id?: number | null;
  totalCost: number;
  paidAmount?: number;
  items: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
    total_price?: number;
  }>;
}): Promise<ApiResponse<Sale>> {
  return await apiFetch<Sale>("/sale", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function addSalePayment(id: number | string, paidAmount: number): Promise<ApiResponse<Sale>> {
  return await apiFetch<Sale>(`/sale/addPayment/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ paidAmount }),
  });
}

export async function checkStock(productId: number | string, stock: number): Promise<boolean> {
  const res = await apiFetch("/sale/checkStock", {
    params: { product: productId, stock },
  });
  return res.success;
}
