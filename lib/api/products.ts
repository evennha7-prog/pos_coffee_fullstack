import { apiFetch } from "./client";
import { Product, ApiResponse } from "./types";

export async function getProducts(params?: {
  search?: string;
  category_id?: number | string;
  page?: number;
  limit?: number;
  sort?: string;
}): Promise<Product[]> {
  const res = await apiFetch<Product[]>("/products", { params });
  return (res.result || res.data || []) as Product[];
}

export async function getProduct(id: number | string): Promise<Product | null> {
  const res = await apiFetch<Product>(`/products/${id}`);
  return res.result || null;
}

export async function getProductByCode(code: string): Promise<Product | null> {
  const res = await apiFetch<Product>(`/products/code/${code}`);
  return res.result || null;
}

export async function createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
  return await apiFetch<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number | string, data: Partial<Product>): Promise<ApiResponse<Product>> {
  return await apiFetch<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number | string): Promise<boolean> {
  const res = await apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
  return res.success;
}
