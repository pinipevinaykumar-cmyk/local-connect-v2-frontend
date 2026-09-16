import type { RegisterPayload, LoginPayload, District, Mandal, Village } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('lc_token') : null;
}

async function req<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || 'Request failed');
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  register: async (data: RegisterPayload) => {
    const res = await req<ApiResponse<{ token: string; user: unknown }>>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
    return res.data;
  },
  login: async (data: LoginPayload) => {
    const res = await req<ApiResponse<{ token: string; user: unknown }>>('/auth/login', { method: 'POST', body: JSON.stringify(data) });
    return res.data;
  },

  // Locations
  districts: async () => {
    const response = await req<ApiResponse<District[]>>('/locations/districts');
    return response.data;
  },
  mandals: async (districtId: number) => {
    const response = await req<ApiResponse<Mandal[]>>(`/locations/districts/${districtId}/mandals`);
    return response.data;
  },
  villages: async (mandalId: number) => {
    const response = await req<ApiResponse<Village[]>>(`/locations/mandals/${mandalId}/villages`);
    return response.data;
  },

  // Businesses
  businesses: async (params?: Record<string, string | number | boolean>) => {
    const res = await req<ApiResponse<unknown[]>>(`/businesses?${new URLSearchParams(
      Object.fromEntries(Object.entries(params ?? {}).map(([k, v]) => [k, String(v)]))
    )}`);
    return res.data;
  },
  myBusinesses: async () => {
    const res = await req<ApiResponse<unknown[]>>('/businesses/my');
    return res.data;
  },
  createBusiness: async (data: unknown) => {
    const res = await req<ApiResponse<unknown>>('/businesses', { method: 'POST', body: JSON.stringify(data) });
    return res.data;
  },
  updateStatus: async (id: number, status: string) => {
    const res = await req<ApiResponse<unknown>>(`/businesses/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    return res.data;
  },

  // Categories
  categories: async () => {
    const res = await req<ApiResponse<unknown[]>>('/categories');
    return res.data;
  },

  // Community
  communityPosts: async (villageId?: number) => {
    const res = await req<ApiResponse<unknown[]>>(`/community${villageId ? `?villageId=${villageId}` : ''}`);
    return res.data;
  },
};
