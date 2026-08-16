import { ApiResponse } from "./types";

const BASE_URL = "/api/v1";

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers, ...restOptions } = options;

  let url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include",
      ...restOptions,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      let errorMessage = data.error || data.message;
      if (!errorMessage) {
        if (res.status === 500 || res.status === 502 || res.status === 504) {
          errorMessage = `Backend server is unreachable (status ${res.status}). Please verify the backend server is running on port 5000.`;
        } else {
          errorMessage = `Request failed with status ${res.status}`;
        }
      }
      return {
        success: false,
        error: errorMessage,
        message: data.message,
      };
    }

    return {
      success: data.success !== undefined ? data.success : true,
      result: data.result !== undefined ? data.result : data.data,
      data: data.data !== undefined ? data.data : data.result,
      totalItem: data.totalItem,
      totalPage: data.totalPage,
      message: data.message,
    };
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      error: error.message || "Network error. Please check your connection.",
    };
  }
}

export default apiFetch;
