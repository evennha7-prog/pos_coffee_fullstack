import { apiFetch } from "./client";
import { GeneralReport, Sale, Product, ApiResponse } from "./types";

export async function getGeneralReport(): Promise<GeneralReport | null> {
  const res = await apiFetch<GeneralReport>("/report");
  return res.result || null;
}

export async function getSaleReport(params: { startDate: string; endDate: string }): Promise<{ totalAmount: number; sales: Sale[] }> {
  const res = await apiFetch<Sale[]>("/report/sale", { params });
  return {
    totalAmount: (res as any).totalAmount || 0,
    sales: (res.result || []) as Sale[],
  };
}

export async function getStockReport(stockQty = 10): Promise<Product[]> {
  const res = await apiFetch<Product[]>("/report/stock", { params: { stockQty } });
  return (res.result || []) as Product[];
}

export async function getSaleReport30Days(): Promise<Array<{ saleDate: string; totalRevenue: number; totalOrders: number }>> {
  const res = await apiFetch<any[]>("/report/in30days");
  return res.result || [];
}
