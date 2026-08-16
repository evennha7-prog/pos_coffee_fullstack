import { apiFetch } from "./client";
import { User, ApiResponse } from "./types";

export async function login(credentials: { email: string; password: string }): Promise<ApiResponse<User>> {
  return await apiFetch<User>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function register(data: { username: string; email: string; password: string; role?: string }): Promise<ApiResponse<User>> {
  return await apiFetch<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<ApiResponse<string>> {
  return await apiFetch<string>("/auth/signout", {
    method: "POST",
  });
}

export async function getMe(): Promise<ApiResponse<User>> {
  return await apiFetch<User>("/auth/me");
}
