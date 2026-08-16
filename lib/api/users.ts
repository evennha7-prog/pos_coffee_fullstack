import { apiFetch } from "./client";
import { User, ApiResponse } from "./types";

export async function getUsers(params?: { search?: string; page?: number; limit?: number }): Promise<User[]> {
  const res = await apiFetch<User[]>("/users", { params });
  return (res.result || res.data || []) as User[];
}

export async function getUser(id: number | string): Promise<User | null> {
  const res = await apiFetch<User>(`/users/${id}`);
  return res.result || null;
}

export async function createUser(data: Partial<User> & { password?: string }): Promise<ApiResponse<User>> {
  return await apiFetch<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: number | string, data: Partial<User> & { password?: string }): Promise<ApiResponse<User>> {
  return await apiFetch<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number | string): Promise<boolean> {
  const res = await apiFetch(`/users/${id}`, {
    method: "DELETE",
  });
  return res.success;
}
