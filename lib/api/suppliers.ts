import { apiFetch } from "./client";
import { Supplier, ApiResponse } from "./types";

export async function getSuppliers(params?: { search?: string; page?: number; limit?: number }): Promise<Supplier[]> {
  const res = await apiFetch<Supplier[]>("/suppliers", { params });
  return (res.result || res.data || []) as Supplier[];
}

export async function getSupplier(id: number | string): Promise<Supplier | null> {
  const res = await apiFetch<Supplier>(`/suppliers/${id}`);
  return res.result || null;
}

export async function createSupplier(data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
  return await apiFetch<Supplier>("/suppliers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSupplier(id: number | string, data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
  return await apiFetch<Supplier>(`/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSupplier(id: number | string): Promise<boolean> {
  const res = await apiFetch(`/suppliers/${id}`, {
    method: "DELETE",
  });
  return res.success;
}
