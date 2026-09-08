import type { RegisterPayload, LoginPayload } from '@/types';

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
  register: (data: RegisterPayload) =>
    req('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: LoginPayload) =>
    req('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // Locations
  districts: () => req('/locations/districts'),
  mandals: (districtId: number) => req(`/locations/districts/${districtId}/mandals`),
  villages: (mandalId: number) => req(`/locations/mandals/${mandalId}/villages`),

  // Businesses
  businesses: (params?: Record<string, string | number | boolean>) =>
    req(`/businesses?${new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {}).map(([k, v]) => [k, String(v)])
      )
    )}`),
  myBusinesses: () => req('/businesses/my'),
  createBusiness: (data: unknown) =>
    req('/businesses', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: number, status: string) =>
    req(`/businesses/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Categories
  categories: () => req('/categories'),

  // Community
  communityPosts: (villageId?: number) =>
    req(`/community${villageId ? `?villageId=${villageId}` : ''}`),
};
