import { apiFetch } from "./client";
import { Category, ApiResponse } from "./types";

export async function getCategories(params?: { search?: string; page?: number; limit?: number }): Promise<Category[]> {
  const res = await apiFetch<Category[]>("/categories", { params });
  return (res.result || res.data || []) as Category[];
}

export async function getCategory(id: number | string): Promise<Category | null> {
  const res = await apiFetch<Category>(`/categories/${id}`);
  return res.result || null;
}

export async function createCategory(data: Partial<Category>): Promise<ApiResponse<Category>> {
  return await apiFetch<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: number | string, data: Partial<Category>): Promise<ApiResponse<Category>> {
  return await apiFetch<Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number | string): Promise<boolean> {
  const res = await apiFetch(`/categories/${id}`, {
    method: "DELETE",
  });
  return res.success;
}
