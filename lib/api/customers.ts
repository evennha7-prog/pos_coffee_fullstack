import { apiFetch } from "./client";
import { Customer, ApiResponse } from "./types";

export async function getCustomers(params?: { search?: string; page?: number; limit?: number }): Promise<Customer[]> {
  const res = await apiFetch<Customer[]>("/customers", { params });
  return (res.result || res.data || []) as Customer[];
}

export async function getCustomer(id: number | string): Promise<Customer | null> {
  const res = await apiFetch<Customer>(`/customers/${id}`);
  return res.result || null;
}

export async function createCustomer(data: Partial<Customer>): Promise<ApiResponse<Customer>> {
  return await apiFetch<Customer>("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCustomer(id: number | string, data: Partial<Customer>): Promise<ApiResponse<Customer>> {
  return await apiFetch<Customer>(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCustomer(id: number | string): Promise<boolean> {
  const res = await apiFetch(`/customers/${id}`, {
    method: "DELETE",
  });
  return res.success;
}
